# Backend API

## Setup
1. Install dependencies: `npm install`
2. Add `serviceAccountKey.json` in `backend/`
3. Configure `.env`
4. Start server: `npm start`

## Deploy to Render
1. Push repo to GitHub.
2. Create a Render Web Service from the backend root.
3. Set build command: `npm install`.
4. Set start command: `npm start`.
5. Add all `.env` values in Render environment settings.
6. Deploy and use generated URL.
