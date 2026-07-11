# Agentic Meal Planner

An AI-powered micro-app that helps users generate a personalized cooking to-do list based on their day, ingredients at home, and total budget.

The app provides a structured meal planning flow that produces:
- A Breakfast, Lunch, and Dinner plan
- A categorized grocery list
- Ingredient substitutions
- Budget feasibility logic

Built with a **React (Vite + TypeScript)** frontend and a **FastAPI** backend, and uses the **Groq** provider via the OpenAI SDK for agentic capabilities.

## Features

- **Personalized Planning:** Enter your daily plan, available ingredients, and daily budget.
- **Web-Powered Pricing:** The agent uses Google Search API to fetch real-time prices for your grocery list.
- **Interactive Chat:** Refine your meal plan dynamically by chatting with the agent.
- **Cost Analysis:** Checks if your plan is feasible within your specified budget.

## Architecture

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Python 3.12, FastAPI
- **Database:** SQLite
- **Agent/LLM:** `openai-sdk` using Groq provider (`openai/gpt-oss-120b`)
- **Deployment:** Render

## Local development

**Backend** (from `backend/`):
```bash
uv sync
cp .env.example .env
uv run uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000`.

**Frontend** (from `frontend/`):
```bash
npm install
cp .env.example .env
npm run dev
```
Frontend runs at `http://localhost:5173`.

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
- Backend: Docker-based Web Service
- Frontend: Static Site built from the Vite production build

1. Push this repo to GitHub/GitLab.
2. In the Render dashboard, choose "New Blueprint" and point it at this repo.
3. Set the `ALLOWED_ORIGINS` env var on the backend and `VITE_API_URL` on the frontend.
