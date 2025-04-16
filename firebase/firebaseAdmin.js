import admin from 'firebase-admin';
import serviceAccount from './firebase/serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'autoshortz-ai.firebasestorage.app',
});

const bucket = admin.storage().bucket();

export { bucket };
