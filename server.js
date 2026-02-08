const path = require('path');
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Gemini モデル名
const GEMINI_MODEL = 'gemini-2.5-flash';

// Middleware
app.use(cors());
app.use(express.json());

// フロントエンド静的ファイルの配信
app.use(express.static(path.join(__dirname, 'dist')));

// Gemini API クライアントの初期化（環境変数 GEMINI_API_KEY から読み込み）
let genAI = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Gemini API initialized from environment variable');
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set. AI features will not work.');
}

// AI Personaチャット生成エンドポイント
app.post('/api/generate-persona-response', async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ error: 'GEMINI_API_KEY 環境変数が設定されていません。サーバー管理者に連絡してください。' });
  }

  const { disease, userMessage, conversationHistory } = req.body;
  
  try {
    // プロンプト構築
    const systemPrompt = `あなたは${disease}の患者です。以下の設定で患者として振る舞ってください：

【患者ペルソナの設定】
- 病名: ${disease}
- 立場: 実際にこの病気と向き合っている患者
- 口調: 自然で親しみやすい、患者目線の言葉遣い
- 内容: リアルな患者の悩み、不安、希望、日常の困りごとを表現

【回答のガイドライン】
1. 患者としての生の声を届ける
2. 治療への不安、副作用の心配、日常生活の困難などリアルな悩みを表現
3. 医療従事者や製薬会社へのニーズを自然に含める
4. 専門用語は患者視点で理解している範囲で使用
5. 200文字以内で簡潔に回答

【会話履歴】
${conversationHistory.map(msg => `${msg.role === 'user' ? 'マーケター' : '患者'}: ${msg.content}`).join('\n')}

マーケター: ${userMessage}

患者として、上記の質問に自然に回答してください：`;

    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: systemPrompt,
    });
    const text = result.text;
    
    res.json({ 
      response: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: `AI応答の生成に失敗しました: ${error.message}`, details: error.message });
  }
});

// Patient Journey生成エンドポイント
app.post('/api/generate-journey', async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ error: 'GEMINI_API_KEY 環境変数が設定されていません。サーバー管理者に連絡してください。' });
  }
  
  const { disease, dashboardData, savedInsights } = req.body;
  
  try {
    const systemPrompt = `あなたは医療用医薬品のマーケティング戦略を立案する専門家です。

【タスク】
${disease}の患者のPatient Journeyを作成してください。以下のデータに基づいて、5つのステージ（認知、関心、検討、決定、継続・共有）それぞれについて詳細を記述してください。

【提供データ】
■ 市場データ
- TAM: ${dashboardData?.tam || '情報なし'}
- SAM: ${dashboardData?.sam || '情報なし'}
- SOM: ${dashboardData?.som || '情報なし'}
- 市場シェア: ${dashboardData?.marketShare || '情報なし'}

■ 患者インサイト（AIペルソナとの対話から）
${savedInsights && savedInsights.length > 0 ? savedInsights.map((insight, i) => `${i + 1}. ${insight.content}`).join('\n') : '特になし'}

【出力形式】
以下のJSON形式で出力してください：

{
  "stages": [
    {
      "name": "認知",
      "behavior": "この段階での患者の具体的な行動（100文字以内）",
      "touchpoints": "患者が接触する媒体やチャネル（カンマ区切り、50文字以内）",
      "thoughts": "患者の心理状態や考え（60文字以内、患者の一人称で）",
      "triggers": "次の段階への行動変容のきっかけ（70文字以内）",
      "marketingPoints": "このステージでのマーケティング上の重要ポイント（80文字以内）",
      "actions": [
        "具体的な施策案1（40文字以内）",
        "具体的な施策案2（40文字以内）",
        "具体的な施策案3（40文字以内）"
      ]
    },
    // 以下、「関心」「検討」「決定」「継続・共有」も同様の構造
  ]
}

【重要な注意点】
1. ${disease}の特性を考慮した内容にすること
2. 患者インサイトを反映させること
3. 実行可能な具体的施策を提案すること
4. JSON形式のみを出力し、説明文は含めないこと
5. 文字数制限を厳守すること

JSON形式で出力してください：`;

    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: systemPrompt,
    });
    let text = result.text;

    // JSONの抽出（```json ``` で囲まれている場合に対応）
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      text = jsonMatch[1];
    }

    // JSONのパース
    const journeyData = JSON.parse(text.trim());

    res.json({
      journey: journeyData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Journey Generation Error:', error);
    res.status(500).json({
      error: `Patient Journeyの生成に失敗しました: ${error.message}`,
      details: error.message
    });
  }
});

// Legal Check生成エンドポイント
app.post('/api/legal-check', async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ error: 'GEMINI_API_KEY 環境変数が設定されていません。サーバー管理者に連絡してください。' });
  }
  
  const { disease, action, stage } = req.body;
  
  try {
    const systemPrompt = `あなたは医薬品の薬事法・広告規制に詳しい専門家です。

【タスク】
以下のマーケティング施策について、日本の薬事法・医薬品医療機器等法（薬機法）の観点から評価し、リスクと対策を提示してください。

【対象疾患】
${disease}

【Patient Journeyのステージ】
${stage}

【評価対象の施策】
${action}

【評価基準】
以下の観点から評価してください：
1. 効能効果の標榜（未承認の効能を謳っていないか）
2. 医薬品広告規制（誇大広告、虚偽広告でないか）
3. 比較広告（競合製品との不当な比較はないか）
4. 医療関係者への情報提供（適切な範囲か）
5. 患者向け情報（医師の指導の重要性を軽視していないか）

【出力形式】
以下のJSON形式で出力してください：

{
  "checks": [
    {
      "issue": "チェック項目名（例：効能効果の標榜）",
      "status": "warning/caution/clear のいずれか",
      "detail": "具体的な問題点の説明（100文字以内）",
      "alternatives": [
        "代替案や回避策1（60文字以内）",
        "代替案や回避策2（60文字以内）",
        "代替案や回避策3（60文字以内）"
      ]
    }
  ]
}

【statusの定義】
- warning: 重大な法規制違反の可能性あり（赤色表示）
- caution: 注意が必要（黄色表示）
- clear: 問題なし（緑色表示）

【重要な注意点】
1. 日本の薬機法に基づいて評価すること
2. 具体的で実行可能な代替案を提示すること
3. 問題がない場合は「clear」とし、alternativesは空配列にすること
4. JSON形式のみを出力し、説明文は含めないこと

JSON形式で出力してください：`;

    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: systemPrompt,
    });
    let text = result.text;

    // JSONの抽出
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      text = jsonMatch[1];
    }

    // JSONのパース
    const legalCheckData = JSON.parse(text.trim());

    res.json({
      legalCheck: legalCheckData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Legal Check Error:', error);
    res.status(500).json({
      error: `Legal Checkの実行に失敗しました: ${error.message}`,
      details: error.message
    });
  }
});

// ルートパス
app.get('/', (req, res) => {
  res.json({
    service: 'Pharma Marketing Backend API',
    status: 'ok',
    endpoints: [
      'POST /api/set-api-key',
      'POST /api/generate-persona-response',
      'POST /api/generate-journey',
      'POST /api/legal-check',
      'GET /health'
    ]
  });
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiKeySet: genAI !== null,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
