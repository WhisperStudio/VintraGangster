// lib/firebaseAdmin.ts
import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = {
    projectId:   process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    // Erstatter hver bokstavelige "\n" i env med ekte newline:
    privateKey:  process.env.FIREBASE_PRIVATE_KEY!
                    .replace(/\\n/g, "\n")
  } as ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const Timestamp = admin.firestore.Timestamp;
