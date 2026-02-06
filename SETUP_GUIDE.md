# Pharma Marketing Solution - セットアップガイド

医療用医薬品マーケティングソリューションの完全セットアップガイドです。

## 📋 必要なもの

- Node.js (v16以上推奨)
- Google Gemini API Key
- 任意のコードエディタ

## 🚀 クイックスタート

### 1. バックエンドのセットアップ

```bash
# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env

# .envファイルを編集してAPI Keyを設定（オプション）
# GEMINI_API_KEY=your_api_key_here
# フロントエンドから設定することもできます

# サーバーの起動
npm run dev
```

サーバーは `http://localhost:3001` で起動します。

### 2. フロントエンドの起動

フロントエンドのReactファイル（`pharma-marketing-solution.jsx`）を以下のいずれかの方法で起動：

#### 方法A: Create React App を使用

```bash
# 新しいReactプロジェクトを作成
npx create-react-app pharma-marketing-frontend
cd pharma-marketing-frontend

# Rechartsをインストール
npm install recharts lucide-react

# pharma-marketing-solution.jsxをsrc/App.jsにコピー

# 開発サーバーを起動
npm start
```

#### 方法B: Viteを使用（推奨 - より高速）

```bash
# 新しいReact + Viteプロジェクトを作成
npm create vite@latest pharma-marketing-frontend -- --template react
cd pharma-marketing-frontend

# 依存パッケージをインストール
npm install
npm install recharts lucide-react

# pharma-marketing-solution.jsxをsrc/App.jsxにコピー

# 開発サーバーを起動
npm run dev
```

フロントエンドは `http://localhost:3000` または `http://localhost:5173` で起動します。

## 🔑 API Keyの設定

### Google Gemini API Keyの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. "Get API Key" をクリック
4. API Keyをコピー

### API Keyの設定方法

#### 方法1: フロントエンドから設定（推奨）

1. アプリケーションを起動
2. ヘッダーの「API設定」ボタンをクリック
3. API Keyを入力して「設定する」をクリック

#### 方法2: .envファイルに設定

```bash
# .env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

## 📁 プロジェクト構造

```
pharma-marketing-solution/
├── server.js                      # バックエンドサーバー (Express)
├── pharma-marketing-solution.jsx  # フロントエンドReactコンポーネント
├── package.json                   # 依存パッケージ
├── .env.example                   # 環境変数のサンプル
├── .env                           # 環境変数（作成が必要）
├── .gitignore                     # Git除外設定
├── README.md                      # APIドキュメント
└── SETUP_GUIDE.md                 # セットアップガイド（本ファイル）
```

## 🔧 トラブルシューティング

### バックエンドに接続できない

**エラー:** `接続エラー: Failed to fetch`

**解決方法:**
1. バックエンドサーバーが起動しているか確認
```bash
npm run dev
```

2. `http://localhost:3001/health` にアクセスして確認

3. CORSエラーの場合、バックエンドのCORS設定を確認

### API Keyエラー

**エラー:** `API Keyが設定されていません`

**解決方法:**
1. フロントエンドの「API設定」から再度API Keyを入力
2. または、`.env`ファイルに`GEMINI_API_KEY`を設定

### JSON解析エラー

**エラー:** `Unexpected token in JSON`

**原因:** Gemini APIがJSON以外の形式で応答している

**解決方法:**
1. バックエンドのコンソールログを確認
2. プロンプトが正しいか確認
3. Gemini APIのレート制限に達していないか確認

### ポートが使用中

**エラー:** `Port 3001 is already in use`

**解決方法:**
```bash
# .env でポート番号を変更
PORT=3002

# フロントエンドのAPI_BASE_URLも変更
const API_BASE_URL = 'http://localhost:3002/api';
```

## 🎯 使い方

### 1. ダッシュボード
- 疾患を選択してデータを確認
- グラフとKPIで市場状況を把握

### 2. AI Personaチャット
- 患者視点での対話を実施
- 重要なインサイトを保存
- リアルな患者ニーズを収集

### 3. Patient Journey生成
- 「Journey生成を開始」ボタンをクリック
- AIが自動的に5ステップのJourneyを生成
- 編集モードで内容をカスタマイズ
- 施策を保存してLegal Checkへ

### 4. Legal Check
- 保存した施策を選択
- 「Legal Check実行」ボタンをクリック
- 薬事法観点での評価と代替案を確認

## 📊 データフロー

```
フロントエンド (React)
    ↓ HTTP Request
バックエンド (Express)
    ↓ API Call
Google Gemini API
    ↓ AI Response
バックエンド (JSON処理)
    ↓ HTTP Response
フロントエンド (表示)
```

## 🔐 セキュリティ

- API Keyは絶対に公開しないでください
- `.env`ファイルは`.gitignore`に含めてください
- 本番環境では環境変数を適切に管理してください

## 📝 ライセンス

ISC

## 🆘 サポート

問題が発生した場合：
1. バックエンドのコンソールログを確認
2. ブラウザの開発者ツールのコンソールを確認
3. `README.md` のAPIドキュメントを参照
