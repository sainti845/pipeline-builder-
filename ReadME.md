cat > README.md << 'EOF'
# 🚀 Ayush Kapruwan - Project

## Pipeline Analysis System

A modern React + FastAPI application for creating and analyzing pipeline workflows with DAG validation.

## 📋 Project Overview

This project demonstrates:
- **Frontend Development** - React with modern patterns and state management
- **Backend Development** - FastAPI with Python and graph algorithms
- **Full-Stack Integration** - Seamless communication between frontend and backend
- **UI/UX Design** - Professional, responsive interface
- **Code Architecture** - Clean, maintainable, and scalable structure

## ✨ Key Features

- **Drag & Drop Pipeline Creation** - Intuitive node-based interface
- **Real-time DAG Validation** - Checks for cycles and validates graph structure
- **Dynamic Node Types** - Input, Output, LLM, and Text nodes with template variables
- **Beautiful UI** - Modern design with toast notifications
- **Responsive Design** - Works on all screen sizes
- **Professional Code Structure** - Follows industry best practices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **ReactFlow 11.8.3** - Professional node-based editor
- **Zustand 4.4.1** - Lightweight state management
- **React Toastify 9.1.3** - Beautiful notifications
- **CSS3** - Modern styling with flexbox, grid, and custom properties

### Backend
- **FastAPI 0.104.1** - Modern Python web framework
- **Pydantic 2.11.7** - Data validation and serialization
- **NetworkX 3.2.1** - Graph algorithms and DAG validation
- **Uvicorn 0.24.0** - ASGI server for production deployment

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and **npm**
- **Python** 3.8+ and **pip**

### 1. Setup Backend
```bash
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn main:app --reload --port 8000
```

### 2. Setup Frontend
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 How to Use

1. **Create Pipeline**: Drag nodes from toolbar to canvas
2. **Connect Nodes**: Click and drag between handles
3. **Add Variables**: Type `{{variableName}}` in text nodes
4. **Analyze**: Click "Submit" to validate pipeline
5. **View Results**: See analysis in toast notifications
