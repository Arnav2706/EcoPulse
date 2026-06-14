# EcoPulse Space 🌍🛰️

**AI-Powered Earth Digital Twin & Space Intelligence Platform**

EcoPulse Space is a real-time environmental monitoring and space intelligence platform that combines a **3D Earth Digital Twin**, **ML-powered AQI prediction**, **NASA space data**, and a **LangGraph multi-agent AI swarm** — all in one premium command center UI.

---

## 🚀 Platform Modules

### 🌍 Digital Twin (`/digital-twin`)
- Interactive **3D Earth** built with Three.js + React Three Fiber
- **5 real-time environmental data layers**: Wildfires 🔥 · Flood Risk 💧 · Vegetation 🌿 · Air Quality 🌬️ · Temperature 🌡️
- GLSL simplex-noise heatmap shaders pinned to real geographic hotspots (California, Australia, Amazon, Congo, South Asia)
- **Timeline slider (2010–2035)** simulating how crises evolve over time
- **AI Copilot sidebar** — context-aware Gemini analysis per active layer

### 🛸 Mission Control (`/mission-control`)
- **City-level AQI prediction** using XGBoost + LSTM ensemble
- **SHAP explainability** — shows which factors (traffic, emissions, humidity) drive the forecast
- 7-day auto-regressive forecast with intervention recommendations and $ savings estimate
- **Leaflet map** with dark tile theme, city fly-to animation
- City selector: San Francisco · New York · Tokyo · London · Sydney · New Delhi

### ☀️ Space Weather (`/space-weather`)
- Live **NASA Near-Earth Object (NEO)** tracker with hazard scoring
- Solar flare & CME event monitoring
- Geomagnetic storm **Kp index** + Aurora visibility forecast
- Click any asteroid → **AI Copilot auto-analyzes** that specific object's trajectory

### 🤖 Aether Swarm (`/aether-control`)
- Direct UI to the **LangGraph 3-agent pipeline**
- Monitoring Agent → Prediction Agent → Commander Agent
- Natural language queries about space/environment processed through the swarm

---

## 🧠 AI Architecture

```
User Query
    ↓
Monitoring Agent  →  Fetches live NASA NEO + Space Weather data
    ↓
Prediction Agent  →  Gemini 2.5 Flash analyzes data against user query
    ↓
Commander Agent   →  Formats professional mission-control style response
    ↓
AI Copilot Sidebar (per-page context-aware)
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React Three Fiber, Three.js, Leaflet, Framer Motion |
| **Backend** | FastAPI (Python), Uvicorn |
| **ML Models** | XGBoost (40%) + PyTorch LSTM (60%) ensemble |
| **AI Agent** | LangGraph multi-agent swarm (Gemini 2.5 Flash via Vertex AI) |
| **Explainability** | SHAP values for ML factor attribution |
| **Space Data** | NASA NeoWs, DONKI (Solar), APOD APIs |
| **3D Rendering** | GLSL shaders, custom atmosphere/heatmap fragment shaders |

---

## ⚙️ Running Locally

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

> **Note**: Copy `backend/.env.example` to `backend/.env` and fill in your `NASA_API_KEY` and GCP credentials.

---

## 📄 Environment Variables

```env
# backend/.env
NASA_API_KEY=your_nasa_api_key_here
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
```

---

*Built by Neural Ninjas*
