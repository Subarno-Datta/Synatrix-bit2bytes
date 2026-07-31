@echo off
echo Installing backend dependencies...
pip install -r requirements.txt
echo.
echo Starting RideRight backend on http://localhost:8000
echo Press Ctrl+C to stop.
echo.
uvicorn main:app --reload --port 8000
