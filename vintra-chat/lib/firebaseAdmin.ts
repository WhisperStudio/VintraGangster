// lib/firebaseAdmin.ts
import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount = {
  projectId:   "DIN_PROJECT_ID",
  clientEmail: "FIREBASE_CLIENT_EMAIL",
  privateKey:  "-----BEGIN PRIVATE KEY-----\\nDIN_PRIVATE_KEY...\\n-----END PRIVATE KEY-----\\n"
} as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const Timestamp = admin.firestore.Timestamp;
