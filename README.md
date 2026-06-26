# CivilPlanner Frontend

React/Vite frontend for CivilPlanner IFC analysis.

## Local setup

1. Install dependencies:

```powershell
npm install
```

2. Create `.env` from `.env.example`.

For local backend development, use:

```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Run the app:

```powershell
npm run dev
```

The app runs on `http://localhost:8080` by default.

## Build

```powershell
npm run build
```

## Deployment notes

- Firebase Hosting is configured in `firebase.json`.
- The API URL is controlled by `VITE_API_BASE_URL`.
- Firebase client config is controlled by `VITE_FIREBASE_*` values, with current project defaults kept for compatibility.
