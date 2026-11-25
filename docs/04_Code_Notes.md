# HireTrack AI — First Backend

## Files created
- `backend/main.py`: contains the FastAPI application and its initial endpoints.
- `backend/__init__.py`: marks the backend directory as a Python package.

## Application object
The `app` variable is an instance of FastAPI. It is the main application object used by Uvicorn to serve incoming requests.

## Endpoints implemented
- `GET /`: returns a welcome message and application status.
- `GET /health`: returns a simple health-check response.

## Server
Uvicorn runs the FastAPI application locally at `http://127.0.0.1:8000`.

## Current limitation
These endpoints return static JSON responses. Database integration, job application management, and AI matching have not yet been implemented.