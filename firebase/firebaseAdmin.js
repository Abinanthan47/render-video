import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "autoshortz-ai.firebasestorage.app" // Replace with your actual bucket
  });
}

const bucket = admin.storage().bucket(); // 👈 this is the bucket you're trying to use

export { admin, bucket }; // 👈 now bucket is available to import
