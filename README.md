# Edito

Is repo me frontend aur backend do alag folders me hain, taaki dono independently
deploy ho sakein.

```
/frontend   -> React + Vite app (client)
/backend    -> Express + Sequelize API (server)
```

## Local setup

**Backend:**
```
cd backend
npm install
cp .env.example .env   # apni DB / Cloudinary keys bharo
npm run dev             # http://localhost:4000
```

**Frontend:**
```
cd frontend
npm install
cp .env.example .env    # VITE_BASE_URL me backend ka URL daalo
npm run dev              # http://localhost:5173
```

## Deploy (Vercel)

Dono ko **alag-alag Vercel project** ke roop me deploy karo, same repo se:

1. Naya Vercel project banao -> is GitHub repo ko import karo -> "Root Directory" me `backend` select karo -> Environment Variables me `.env.example` ke saare vars daalo -> Deploy.
2. Ek aur Vercel project banao -> same repo import karo -> "Root Directory" me `frontend` select karo -> Environment Variables me `VITE_BASE_URL` = backend wale project ka URL (e.g. `https://edito-backend.vercel.app/api/v1/videos`) daalo -> Deploy.

Backend `api/[...all].js` se sirf **1 Serverless Function** banta hai, isliye Hobby
plan ki 12-function limit wali error nahi aayegi.
