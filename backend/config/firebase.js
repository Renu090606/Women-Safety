const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);

if (!fs.existsSync(resolvedPath)) {
  throw new Error('Firebase service account key file not found. Please add backend/serviceAccountKey.json.');
}

if (!admin.apps.length) {
  const serviceAccount = require(resolvedPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();
const rtdb = admin.database();
const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.FieldValue;

module.exports = { admin, db, rtdb, FieldValue, Timestamp };
