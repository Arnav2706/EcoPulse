# 🌍 EcoPulse Space

> **AI-Powered Earth Digital Twin & Space Intelligence Platform**
>
> Real-time environmental monitoring + NASA space data + LangGraph multi-agent AI swarm — all in one premium command center.

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Three.js-r165-000000?style=for-the-badge&logo=three.js" />
  <img src="https://img.shields.io/badge/LangGraph-0.2-FF6B35?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker" />
</div>

---

## 🐳 Quick Start with Docker (Recommended)

> **Prerequisites**: Docker Desktop installed and running.

### 1. Clone the repo
```bash
git clone https://github.com/Arnav2706/EcoPulse.git
cd EcoPulse
```

### 2. Set up environment variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in:
#   NASA_API_KEY   → get free at https://api.nasa.gov/
#   GOOGLE_CLOUD_PROJECT → your GCP project ID
```

### 3. Add GCP credentials
```bash
# Place your GCP service account JSON at:
backend/gcp_key.json
# (This file is gitignored — never commit it)
```

### 4. Launch everything
```bash
docker compose up --build
```

| Service | URL |
|---|---|
| 🌍 Frontend (Next.js) | http://localhost:3000 |
| ⚙️ Backend (FastAPI) | http://localhost:8000 |
| 📖 API Docs (Swagger) | http://localhost:8000/docs |

### Stop
```bash
docker compose down
```

---

## 💻 Local Development (without Docker)

<details>
<summary><strong>Backend (FastAPI + ML)</strong></summary>

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env
# Fill in NASA_API_KEY and GOOGLE_CLOUD_PROJECT in .env

# Start server
uvicorn main:app --reload --port 8000
# → http://localhost:8000
# → API docs: http://localhost:8000/docs
```
</details>

<details>
<summary><strong>Frontend (Next.js 16)</strong></summary>

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000
```
</details>

---

## 🗺️ Platform Modules

### 🌍 Digital Twin — `/digital-twin`
The centerpiece of EcoPulse. A photorealistic interactive **3D Earth** built with Three.js + React Three Fiber.

**Features:**
- **5 live environmental data layers** — toggle independently:
  - 🔥 **Wildfires** — California, Australia, Siberia hotspots
  - 💧 **Flood Risk** — Bangladesh, Netherlands, Louisiana zones
  - 🌿 **Vegetation** — Amazon, Congo, Borneo, Boreal forest carbon density
  - 🌬️ **Air Quality** — India, China, Eastern Europe pollution corridors
  - 🌡️ **Temperature** — Global anomaly heatmap
- **GLSL simplex-noise shaders** — heatmaps rendered as GPU fragment shaders, pinned to real geographic coordinates
- **Timeline slider (2010–2035)** — simulates how crises evolve and spread over 25 years
- **Orbital debris field** — animated particle system representing satellite/debris tracks
- **AI Copilot sidebar** — context-aware Gemini 2.5 analysis per active layer + per selected city

---

### 🛸 Mission Control — `/mission-control`
City-level **AQI prediction** with full ML explainability.

**Features:**
- **Hybrid ML model**: XGBoost (40%) + PyTorch LSTM (60%) ensemble
- **Input features**: Temperature, humidity, wind speed, traffic density, industrial emissions, green cover index, satellite NDVI
- **SHAP explainability panel** — bar chart showing which factors drive the forecast (e.g., "42% Industrial Emissions, 31% Traffic")
- **7-day auto-regressive forecast** with confidence intervals
- **Intervention recommendations** with estimated ΔCO₂ reductions and $ regulatory savings
- **Leaflet map** with dark tile theme — flies to selected city on change
- **City profiles**: San Francisco · New York · Tokyo · London · Sydney · New Delhi · Beijing

---

### ☀️ Space Weather — `/space-weather`
Live feed of NASA data on threats from space.

**Features:**
- **Near-Earth Object (NEO) tracker** — live NASA API data with hazard scoring, miss distance, size estimates
- **Solar flare monitor** — GOES X-ray flux data with flare class (B/C/M/X)
- **CME (Coronal Mass Ejection)** event log with Earth-impact probability
- **Geomagnetic Kp index** — 3-hour resolution storm intensity gauge
- **Aurora visibility forecast** — predicted visibility latitude bands
- **Click any NEO** → AI Copilot auto-generates a full telemetry analysis of that specific object

---

### 🤖 Aether Swarm — `/aether-control`
Direct interface to the **LangGraph multi-agent pipeline**.

**Features:**
- Visualizes the **3-agent swarm** in real time: Monitor → Predict → Command
- Natural language queries about any space or environmental topic
- Agent node status indicators — shows which agent is currently processing
- Full response streaming from the Gemini 2.5 Flash model

---

## 🧠 AI Architecture

```
User Query (natural language)
          │
          ▼
  ┌───────────────────┐
  │  Monitoring Agent  │  ← Fetches live NASA NEO + DONKI solar weather data
  └────────┬──────────┘
           │
          ▼
  ┌───────────────────┐
  │  Prediction Agent  │  ← Gemini 2.5 Flash analyzes data vs user's context
  └────────┬──────────┘
           │
          ▼
  ┌───────────────────┐
  │  Commander Agent  │  ← Formats mission-control style response
  └────────┬──────────┘
           │
          ▼
  AI Copilot Sidebar (per-page, context-aware)
```

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 16 + React 19 | App shell, routing, SSR |
| **3D Rendering** | Three.js + React Three Fiber | Earth globe, shaders, debris |
| **GLSL Shaders** | Custom fragment shaders | Heatmaps, atmosphere, nebula |
| **Maps** | Leaflet.js | 2D city map in Mission Control |
| **Animations** | Framer Motion | Page transitions, micro-animations |
| **Backend** | FastAPI + Uvicorn | REST API, ML serving |
| **ML — Tabular** | XGBoost (scikit-learn) | AQI feature importance |
| **ML — Temporal** | PyTorch LSTM | Time-series AQI forecasting |
| **Explainability** | SHAP | Feature attribution visualization |
| **AI Agent** | LangGraph 0.2 | Multi-agent swarm orchestration |
| **LLM** | Gemini 2.5 Flash (Vertex AI) | Natural language analysis |
| **Space Data** | NASA NeoWs, DONKI, APOD APIs | Live NEO + solar weather |
| **Containerization** | Docker + Docker Compose | One-command deployment |

---

## 📁 Project Structure

```
ecopulse-space/
├── docker-compose.yml          # Orchestrate both services
├── backend/
│   ├── Dockerfile
│   ├── main.py                 # FastAPI app + all API routes
│   ├── agents_swarm.py         # LangGraph multi-agent swarm
│   ├── space_apis.py           # NASA API integrations
│   ├── requirements.txt
│   └── .env.example            # Environment variable template
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/
        │   ├── page.tsx                    # Landing page
        │   ├── digital-twin/page.tsx       # 3D Earth + env layers
        │   ├── mission-control/page.tsx    # AQI prediction + Leaflet map
        │   ├── space-weather/page.tsx      # NASA NEO + solar monitor
        │   └── aether-control/page.tsx     # Aether Swarm UI
        └── components/
            ├── Globe.tsx           # Three.js Earth + GLSL shaders
            ├── AiCopilot.tsx       # AI Copilot sidebar
            ├── NebulaShader.tsx    # Animated starfield shader
            ├── Map.tsx             # Leaflet map wrapper
            ├── TopNavBar.tsx       # Navigation
            └── Footer.tsx          # Status bar + telemetry ticker
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/predict` | POST | AQI prediction (city + features) |
| `/space/neo` | GET | Live Near-Earth Objects from NASA |
| `/space/solar-weather` | GET | Solar flares, CMEs, Kp index |
| `/agent/query` | POST | Run multi-agent swarm query |

Full interactive docs: **http://localhost:8000/docs**

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NASA_API_KEY` | ✅ | Free key from https://api.nasa.gov/ |
| `GOOGLE_CLOUD_PROJECT` | ✅ | Your GCP project ID for Vertex AI |
| `GOOGLE_CLOUD_LOCATION` | Optional | Default: `us-central1` |
| `GOOGLE_APPLICATION_CREDENTIALS` | ✅ | Path to service account JSON |

---

## 🙌 Built By

**Neural Ninjas** — Built for [Hackathon Name]

---

<div align="center">
  <sub>⚡ Powered by Gemini 2.5 Flash · NASA Open APIs · Three.js · LangGraph</sub>
</div>
