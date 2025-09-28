#!/bin/bash
# Start FastAPI backend on Railway

# Install dependencies (just in case)
pip install --upgrade pip
pip install -r requirements.txt

# Start the FastAPI app
# app.app2: app → means app folder → app2.py → FastAPI instance 'app'
uvicorn app.app2:app --host 0.0.0.0 --port ${PORT:-8000}
