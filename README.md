<<<<<<< HEAD
# Women Safety Platform

This repository contains three applications:
- `MobileApp`: React Native app for passengers and drivers.
- `backend`: Node.js + Express API with Firebase Admin and Twilio integration.
- `admin-dashboard`: React TypeScript dashboard for operations and monitoring.

## Setup Order

1. Create Firebase project and enable Email/Password authentication.
2. Create Firestore (test mode) and Realtime Database (test mode).
3. Enable Firebase Cloud Messaging.
4. Register Android app and place `google-services.json` in `MobileApp/android/app/`.
5. Download Firebase service account key and place `serviceAccountKey.json` in `backend/`.
6. Fill `.env` files in:
   - `MobileApp/.env`
   - `backend/.env`
   - `admin-dashboard/.env`
7. Seed Firebase data:
   - `cd backend`
   - `npm run seed`
8. Start backend:
   - `npm start`
9. Start admin dashboard:
   - `cd ../admin-dashboard`
   - `npm start`
10. Start mobile app:
    - `cd ../MobileApp`
    - `npx react-native run-android`

## Test Seed Data

### Aadhaar Numbers
- `111122223333`
- `222233334444`
- `333344445555`
- `444455556666`
- `555566667777`

### Driver License IDs
- `DL001`
- `DL002`
- `DL003`
- `DL004`
- `DL005`

=======
# Women-Safety-
>>>>>>> e634f1fe8f0ab25ef7a6fbd30b86fa5b2c882852
