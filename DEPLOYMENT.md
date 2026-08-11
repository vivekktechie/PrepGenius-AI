# 🚀 PrepGenius AI — Deployment Guide

Deploy the full stack to **Vercel** (frontend) and **Render** (backend + AI service).

---

## Pre-requisites

- GitHub account with this project pushed as a repo
- [Vercel account](https://vercel.com) (free)
- [Render account](https://render.com) (free)
- All secrets ready (TiDB credentials, Gemini API key, Gmail app password)

---

## Step 1 — Push to GitHub

```bash
cd "/Users/vivek3903/WebApps/PrepGenius AI"
git init
git add .
git commit -m "feat: initial deployment setup"
git remote add origin https://github.com/YOUR_USERNAME/prepgenius-ai.git
git push -u origin main
```

> **Important**: `.env` files are in `.gitignore` — they will NOT be pushed. Set all secrets in the dashboards below.

---

## Step 2 — Deploy Backend to Render

### 2a. Create a Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `prepgenius-ai-server` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Plan** | Free |

### 2b. Set Environment Variables

In **Environment** tab, add each key:

| Variable | Value |
|----------|-------|
| `TIDB_HOST` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| `TIDB_USER` | `3Dp5kHHw2KXQuwc.root` |
| `TIDB_PASSWORD` | `cuk4DGzB1tWInyYh` |
| `TIDB_PORT` | `4000` |
| `TIDB_DB_NAME` | `test` |
| `JWT_SECRET` | *(use a strong random string in production)* |
| `GOOGLE_API_KEY` | `AIzaSyB3uI8t83l7c3yStlleW92djY8Ju_e9ffs` |
| `GMAIL_APP_PASSWORD` | `bzeynzmvfdzyidhd` |
| `CLIENT_URL` | *(fill in after Step 3 — your Vercel URL)* |
| `SERVER_URL` | *(your Render service URL e.g. `https://prepgenius-ai-server.onrender.com`)* |
| `NODE_ENV` | `production` |

3. Click **Create Web Service** — Render will build and deploy automatically.
4. Copy your **Render service URL** (e.g. `https://prepgenius-ai-server.onrender.com`) — you'll need it for Vercel.

---

## Step 3 — Deploy AI Service to Render (Optional)

### 3a. Create a second Web Service

1. **New** → **Web Service** → same repo
2. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `prepgenius-ai-service` |
| **Root Directory** | `ai-service` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free |

> **Note**: The free tier has 512MB RAM. The `requirements.txt` is slimmed down for compatibility. Advanced NLP (spaCy, Transformers, PyTorch) requires a paid plan.

---

## Step 4 — Deploy Frontend to Vercel

### 4a. Import Project

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repo
3. Set **Root Directory** to `client`
4. Confirm settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install --legacy-peer-deps` |

### 4b. Set Environment Variables

In **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://prepgenius-ai-server.onrender.com/api` |
| `VITE_SUPABASE_URL` | `https://jdhshnrtesesseymxqal.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(your Supabase anon key from the Supabase dashboard)* |

5. Click **Deploy**.

### 4c. Wire CORS back to Render

After Vercel gives you your app URL (e.g. `https://prepgenius-ai.vercel.app`):

- Go to Render backend → **Environment** → set `CLIENT_URL` = `https://prepgenius-ai.vercel.app`
- Trigger a **Manual Deploy** on Render

---

## Step 5 — Verify

- [ ] Visit your Vercel URL — landing page loads
- [ ] Try registering / logging in — JWT + TiDB works
- [ ] Check browser console for any CORS or 404 errors

---

## Production Notes

### Ollama (Local LLM)
`OLLAMA_HOST=http://localhost:11434` cannot run on Render. Routes that use Ollama gracefully fall back to the Google Gemini API in production (no code change needed).

### File Uploads
Render's disk is **ephemeral** — uploaded files vanish on redeploy. For persistence, migrate uploads to **Supabase Storage** or Cloudinary (future enhancement).

### Free Tier Cold Starts
Render free tier spins down after 15 min of inactivity. First request after idle may take 30–60s. Upgrade to a paid plan ($7/mo) to eliminate this.

### Custom Domain
- **Vercel**: Settings → Domains → Add domain
- **Render**: Settings → Custom Domains → Add domain
- Then update `CLIENT_URL`, `SERVER_URL`, and `VITE_API_URL` accordingly

---

## File Structure Added

```
PrepGenius AI/
├── .gitignore                          ← root gitignore (secrets excluded)
├── DEPLOYMENT.md                       ← this guide
├── client/
│   ├── vercel.json                     ← SPA routing + build config
│   ├── .env.production.template        ← Vercel env vars reference
│   └── src/lib/api.js                  ← uses VITE_API_URL env var
├── server/
│   ├── render.yaml                     ← Render service definition
│   ├── .env.render.template            ← Render env vars reference
│   └── index.js                        ← PORT / CORS / upload URL fixed
└── ai-service/
    ├── render.yaml                     ← Render service definition
    ├── requirements.txt                ← slimmed for free tier
    └── main.py                         ← uses $PORT from env
```
