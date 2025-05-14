#!/bin/bash
set -e

# Start the API server in the background
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
API_PID=$!

# Start the worker in the background
python -m app.worker.main &
WORKER_PID=$!

# Handle termination signals
trap "kill $API_PID $WORKER_PID; exit" SIGINT SIGTERM

# Keep the script running
wait $API_PID $WORKER_PID 