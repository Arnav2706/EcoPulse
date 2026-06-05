# EcoPulse AI 🌱

**An Environmental Risk Forecasting & Intervention Intelligence Platform**

EcoPulse AI predicts environmental risks before they happen, explains why they will happen, and recommends the best actions to prevent them—calculating the exact financial ROI (fines avoided) of each action.

We are building an **Environmental Copilot for Governments and Enterprise**, going far beyond generic AQI dashboards.

---

## 🚀 The Core Engine
1. **Deep Learning Forecasting:** A highly rigorous ensemble model (60% PyTorch LSTM / 40% XGBoost) built on a 365-day dataset integrating Temporal Lags and Satellite NDVI metrics.
2. **Explainable AI (SHAP):** Transparently breaks down the "Why" behind the risk forecast (e.g., 42% Industrial Emissions, 31% Traffic).
3. **Intervention Intelligence:** Recommends specific, highly targeted policy actions (e.g., Throttle Factory Output) and calculates the exact Drop in AQI and Dollars Saved in regulatory compliance.
4. **Digital Twin Simulator:** A sandbox for city planners to dynamically scale variables (Traffic, Wind Speed, Emissions) and instantly watch the neural network recalculate environmental outcomes.
5. **Generative AI Policy Copilot:** A context-aware chatbot that reads live telemetry to draft executive policy briefings on demand.

---

## 🏗️ Architecture Stack
- **Frontend:** Next.js, React, TailwindCSS, Framer Motion, Leaflet Maps
- **Backend:** FastAPI, Python, Uvicorn
- **AI / ML Models:** PyTorch (LSTM), Scikit-Learn (XGBRegressor), SHAP

---

## ⚙️ How to Run Locally

### 1. Start the ML Backend (FastAPI)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start the Digital Twin (Next.js)
```bash
cd frontend
npm install
npm run dev -p 3001
```

Access the Global Command Center at: `http://localhost:3001/command-center`

---
*Built by the Neural Ninjas*
