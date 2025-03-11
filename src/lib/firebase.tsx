import admin from "firebase-admin";
import { Bucket } from "@google-cloud/storage";

let bucket: Bucket | null = null;

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_STORAGE_BUCKET) {
      admin.initializeApp({
        credential: admin.credential.cert(
          JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString())
        ),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      bucket = admin.storage().bucket();
      console.log("✅ Firebase initialized successfully");
    } else {
      console.warn("⚠️ Firebase environment variables are missing.");
    }
  } else {
    bucket = admin.storage().bucket();
  }
} catch (error) {
  console.error("🚨 Firebase initialization error:", error);
}

export { bucket };