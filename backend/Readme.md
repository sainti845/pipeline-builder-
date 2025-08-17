cat > backend/README.md << 'EOF'
# Backend - Pipeline Analysis API

## Quick Start
1. Create virtual environment: `python3 -m venv .venv`
2. Activate: `source .venv/bin/activate` (macOS/Linux) or `.venv\\Scripts\\activate` (Windows)
3. Install: `pip install -r requirements.txt`
4. Run: `python -m uvicorn main:app --reload --port 8000`

## API Endpoints
- `GET /` - Health check
- `POST /pipelines/parse` - Analyze pipeline structure

## Dependencies
- FastAPI 0.104.1
- Uvicorn 0.24.0
- Pydantic 2.11.7
- NetworkX 3.2.1

## Features
- Pipeline DAG validation
- Node and edge counting
- Graph cycle detection
- RESTful API design
EOF