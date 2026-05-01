# Admin Dashboard

React + TypeScript admin dashboard for women safety transport operations.

## Local Run

1. Install dependencies:
   - `npm install`
2. Create `.env` in `admin-dashboard` with:
   - `REACT_APP_BACKEND_URL=http://localhost:5000`
   - `REACT_APP_FIREBASE_API_KEY=...`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN=...`
   - `REACT_APP_FIREBASE_PROJECT_ID=...`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET=...`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...`
   - `REACT_APP_FIREBASE_APP_ID=...`
3. Start development server:
   - `npm start`
4. Open `http://localhost:3000`.

## Production Build

- `npm run build`

## Firebase Hosting Deploy

1. Install Firebase CLI (if not installed):
   - `npm install -g firebase-tools`
2. Login:
   - `firebase login`
3. Initialize hosting once inside `admin-dashboard`:
   - `firebase init hosting`
   - choose existing Firebase project
   - public directory: `build`
   - single-page app rewrite: `Yes`
4. Build app:
   - `npm run build`
5. Deploy:
   - `firebase deploy --only hosting`

## Admin Access Rule

- Dashboard login uses Firebase Auth.
- Access is allowed only when Firestore document `users/{uid}` has `role: "admin"`.
