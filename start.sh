#!/bin/bash
pip install -r requirements.txt
uvicorn app.app2:app --host 0.0.0.0 --port $PORT
