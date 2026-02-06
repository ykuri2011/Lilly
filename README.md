# Pharma Marketing Solution - Backend

医療用医薬品マーケティングソリューションのバックエンドAPI

## 機能

- **AI Personaチャット**: Gemini APIを使用して患者ペルソナとの対話を生成
- **Patient Journey生成**: 市場データとインサイトから患者ジャーニーを自動生成
- **Legal Check**: 薬事法観点でマーケティング施策を評価

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd backend
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、Google Gemini APIキーを設定します：

```bash
cp .env.example .env
```

`.env`ファイルを編集：

```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

### 3. サーバーの起動

```bash
# 開発モード（自動再起動）
npm run dev

# 本番モード
npm start
```

サーバーは `http://localhost:3001` で起動します。

## API エンドポイント

### 1. API Key設定

**POST** `/api/set-api-key`

フロントエンドからGemini API Keyを動的に設定します。

```json
{
  "apiKey": "your_gemini_api_key"
}
```

**レスポンス:**
```json
{
  "success": true,
  "message": "API Keyが設定されました"
}
```

### 2. AI Personaチャット

**POST** `/api/generate-persona-response`

患者ペルソナとしてのAI応答を生成します。

```json
{
  "disease": "糖尿病",
  "userMessage": "治療を続けるモチベーションは何ですか？",
  "conversationHistory": [
    {
      "role": "user",
      "content": "診断されたときどう感じましたか？"
    },
    {
      "role": "assistant",
      "content": "最初は不安でいっぱいでした..."
    }
  ]
}
```

**レスポンス:**
```json
{
  "response": "家族のためにも健康でいたいという思いが大きいです...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Patient Journey生成

**POST** `/api/generate-journey`

市場データとインサイトからPatient Journeyを生成します。

```json
{
  "disease": "糖尿病",
  "dashboardData": {
    "tam": "450万人",
    "sam": "180万人",
    "som": "45万人",
    "marketShare": "25%"
  },
  "savedInsights": [
    {
      "content": "血糖値の自己測定が負担です..."
    }
  ]
}
```

**レスポンス:**
```json
{
  "journey": {
    "stages": [
      {
        "name": "認知",
        "behavior": "症状に気づき、情報を検索し始める",
        "touchpoints": "Web検索、SNS、家族・友人との会話",
        "thoughts": "何が起きているのか不安。早く原因を知りたい",
        "triggers": "症状の悪化、周囲からの指摘",
        "marketingPoints": "正確でわかりやすい疾患情報の提供が重要",
        "actions": [
          "疾患啓発Webサイトの最適化",
          "SNS上での信頼できる情報発信",
          "患者コミュニティとの連携"
        ]
      }
      // ... 他のステージ
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. Legal Check

**POST** `/api/legal-check`

マーケティング施策を薬事法観点で評価します。

```json
{
  "disease": "糖尿病",
  "action": "SNS上での疾患啓発キャンペーン",
  "stage": "認知"
}
```

**レスポンス:**
```json
{
  "legalCheck": {
    "checks": [
      {
        "issue": "効能効果の標榜",
        "status": "warning",
        "detail": "疾患啓発コンテンツで製品の効能を直接訴求している可能性があります",
        "alternatives": [
          "疾患情報と製品情報を明確に分離する",
          "一般的な治療選択肢の一つとして中立的に記載する",
          "医療従事者向けページに詳細情報を配置する"
        ]
      },
      {
        "issue": "医薬品広告規制",
        "status": "caution",
        "detail": "SNS発信において、広告であることの明示が必要です",
        "alternatives": [
          "投稿に「広告」「PR」の表記を追加",
          "医療従事者監修の明記",
          "問い合わせ先の明確な記載"
        ]
      },
      {
        "issue": "比較広告",
        "status": "clear",
        "detail": "競合製品との直接比較は行われていません。適切です。",
        "alternatives": []
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5. ヘルスチェック

**GET** `/health`

サーバーとAPI Keyの設定状態を確認します。

**レスポンス:**
```json
{
  "status": "ok",
  "apiKeySet": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## エラーレスポンス

すべてのエンドポイントは以下の形式でエラーを返します：

```json
{
  "error": "エラーメッセージ",
  "details": "詳細情報（オプション）"
}
```

一般的なHTTPステータスコード：
- `400`: リクエストが不正（API Key未設定など）
- `500`: サーバーエラー（AI生成失敗など）

## Gemini API Key取得方法

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. "Get API Key"をクリック
4. 生成されたAPI Keyをコピー
5. `.env`ファイルまたはフロントエンドの設定画面で使用

## 注意事項

- API Keyは秘密情報です。公開リポジトリにコミットしないでください
- `.env`ファイルは`.gitignore`に含めてください
- 本番環境では環境変数を適切に管理してください
- Gemini APIには使用量制限があります。詳細は[公式ドキュメント](https://ai.google.dev/pricing)を参照してください

## トラブルシューティング

### API Key設定エラー

```
Error: API Keyが設定されていません
```

→ `/api/set-api-key` エンドポイントでAPI Keyを設定するか、`.env`ファイルを確認してください

### JSON解析エラー

```
Error: Unexpected token in JSON
```

→ Gemini APIのレスポンスがJSON形式でない可能性があります。プロンプトを調整してください

### CORS エラー

フロントエンドから接続できない場合、CORSの設定を確認してください。デフォルトではすべてのオリジンを許可していますが、本番環境では制限することを推奨します。

## ライセンス

ISC
