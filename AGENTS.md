# AGENTS.md

Read this file first before making any changes.

## What this repo is

A hello-world skeleton for an agentic AI app: FastAPI backend + React (Vite/TypeScript) frontend, proven to talk to each other, with **no LLM provider or agent framework chosen yet**. That decision is deliberately deferred.

## Before adding any agent/LLM logic

Read `docs/PROBLEM_STATEMENT.md`. If its sections are still empty template comments (no real content filled in), stop and ask the developer to fill it in before you choose a framework, provider, or add tools/RAG/multi-agent logic. Once it's filled in, use it to decide the architecture — this template does not prescribe one.

## Tech stack

- Backend: Python 3.12, FastAPI, `pydantic-settings` for config, `uv` for dependency management, `pytest` for tests.
- Frontend: React 18, TypeScript, Vite, `vitest` + `@testing-library/react` for tests.
- Local orchestration: `docker-compose.yml`.
- Deployment: `render.yaml` blueprint (backend = Docker Web Service, frontend = Static Site).

## Commands

- Backend dev server: `cd backend && uv run uvicorn app.main:app --reload`
- Backend tests: `cd backend && uv run pytest`
- Frontend dev server: `cd frontend && npm run dev`
- Frontend tests: `cd frontend && npm test`
- Both together: `docker compose up --build`

## Conventions

- Backend routes live in `backend/app/main.py`; config lives in `backend/app/config.py` and is read from `.env` via `pydantic-settings`. Follow this pattern when adding new routes/settings rather than introducing a new config mechanism.
- Frontend API base URL comes from `VITE_API_URL` (see `frontend/.env.example`), read via `import.meta.env`. Reuse this pattern for any other frontend-configurable values.
- Tests live next to what they test: `backend/tests/` mirrors `backend/app/`; frontend test files sit beside their component (`App.test.tsx` next to `App.tsx`).
