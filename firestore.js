const admin = require('firebase-admin');

// Firebase Admin SDK の初期化
// 環境変数 GOOGLE_APPLICATION_CREDENTIALS にサービスアカウントキーのパスを設定するか、
// FIREBASE_PROJECT_ID を直接設定してください
let db = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // サービスアカウントJSON文字列から初期化
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // 環境変数でファイルパスが指定されている場合
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // プロジェクトIDのみ指定（Cloud Run等のマネージド環境向け）
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // デフォルト初期化（GCP環境やエミュレータ向け）
    admin.initializeApp();
  }

  db = admin.firestore();
  console.log('Firestore initialized successfully');
} catch (error) {
  console.warn('Firestore initialization failed:', error.message);
  console.warn('Firestore features will be disabled. Set FIREBASE_SERVICE_ACCOUNT, GOOGLE_APPLICATION_CREDENTIALS, or FIREBASE_PROJECT_ID.');
}

module.exports = { db, admin };
