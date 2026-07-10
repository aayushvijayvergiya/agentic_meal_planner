# Agentic AI Quickapp Template

A starter template for building agentic AI apps with a **React (Vite + TypeScript)** frontend and a **FastAPI** backend. It ships a minimal working "hello world" skeleton — it does **not** ship a pre-chosen LLM provider or agent framework. Those decisions come later, driven by your specific problem.

## How this template works

1. Clone this template.
2. Fill in [`docs/PROBLEM_STATEMENT.md`](docs/PROBLEM_STATEMENT.md) — describe what your agent should do, what tools/data it needs, and any architecture preferences you already have.
3. Run the hello-world skeleton locally (below) to confirm the base setup works.
4. Point your coding agent (Claude Code, Codex, etc.) at the repo and ask it to proceed. It will read [`AGENTS.md`](AGENTS.md), which in turn points it at your filled-in problem statement, and it will decide the real architecture from there.
5. Deploy via the Render blueprint once you're ready (see below).

## Local development

**Backend** (from `backend/`):
```bash
uv sync
cp .env.example .env
uv run uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000`. Check `http://localhost:8000/health`.

**Frontend** (from `frontend/`):
```bash
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173` and displays the backend's health status.

**Tests:**
```bash
cd backend && uv run pytest
cd frontend && npm test
```

**Everything together with Docker:**
```bash
docker compose up --build
```

## Deploying to Render

This repo includes a `render.yaml` blueprint that provisions two services:
- `agentic-quickapp-backend` — a Docker-based Web Service built from `backend/Dockerfile`.
- `agentic-quickapp-frontend` — a Static Site built from the Vite production build.

Steps:
1. Push this repo to GitHub/GitLab.
2. In the Render dashboard, choose "New Blueprint" and point it at this repo — Render reads `render.yaml` and provisions both services.
3. Set the `ALLOWED_ORIGINS` env var on the backend service to your frontend's Render URL, and `VITE_API_URL` on the frontend service to your backend's Render URL (Render will prompt for these since they're marked `sync: false`).
4. Redeploy the frontend after setting `VITE_API_URL`, since Vite bakes it in at build time.

`docker-compose.yml` is for local development only — Render does not use it directly.
