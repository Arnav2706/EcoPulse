from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import pandas as pd
import numpy as np
import pickle
import shap
import torch
import torch.nn as nn
from datetime import datetime

# Define LSTM architecture for loading
class AQILSTM(nn.Module):
    def __init__(self, input_size, hidden_size=64, num_layers=2):
        super(AQILSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])
        return out

app = FastAPI(title="EcoPulse AI Advanced Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
xgb_model = None
lstm_model = None
scaler = None
explainer = None

FEATURES = [
    'temperature', 'humidity', 'wind_speed', 'traffic_density', 
    'industrial_emissions', 'green_cover_index', 'ndvi_satellite_index', 
    'day_of_week', 'is_weekend', 'aqi_lag_1', 'aqi_lag_2', 'aqi_lag_3', 'aqi_rolling_7d_avg'
]

@app.on_event("startup")
def load_models():
    global xgb_model, lstm_model, scaler, explainer
    try:
        with open("models/xgb_aqi_model.pkl", "rb") as f:
            xgb_model = pickle.load(f)
        explainer = shap.Explainer(xgb_model)
        
        with open("models/scaler.pkl", "rb") as f:
            scaler = pickle.load(f)
            
        lstm_model = AQILSTM(input_size=len(FEATURES))
        lstm_model.load_state_dict(torch.load("models/lstm_aqi_model.pth"))
        lstm_model.eval()
        
        print("✅ XGBoost, PyTorch LSTM, and SHAP explainer loaded successfully.")
    except Exception as e:
        print(f"Warning: Could not load models. {e}")

class EnvironmentData(BaseModel):
    city: str = "Visakhapatnam"
    temperature: float
    humidity: float
    wind_speed: float
    traffic_density: float
    industrial_emissions: float
    green_cover_index: float

def prepare_advanced_features(data: EnvironmentData):
    input_dict = data.model_dump()
    city = input_dict.pop('city', 'Visakhapatnam')
    
    # City-specific baselines (Simulated Regional Digital Twin Adjustments)
    if city == "New Delhi":
        input_dict['traffic_density'] *= 1.4 # High traffic base
        input_dict['wind_speed'] *= 0.6      # Low wind stagnation
    elif city == "Almaty":
        input_dict['temperature'] -= 15.0    # Cold climate
        input_dict['industrial_emissions'] *= 1.3 # Coal heating
    elif city == "Mumbai":
        input_dict['humidity'] = max(input_dict['humidity'], 80.0) # Coastal
    elif city == "London":
        input_dict['temperature'] -= 10.0
        input_dict['green_cover_index'] += 20.0 # Better parks
        
    now = datetime.now()
    input_dict['ndvi_satellite_index'] = 0.5 + (data.green_cover_index / 200.0)
    input_dict['day_of_week'] = now.weekday()
    input_dict['is_weekend'] = 1 if now.weekday() >= 5 else 0
    
    # Base lags off of the current city's severity
    base_lag = 110.0 if city != "New Delhi" else 180.0
    input_dict['aqi_lag_1'] = base_lag
    input_dict['aqi_lag_2'] = base_lag - 5.0
    input_dict['aqi_lag_3'] = base_lag - 12.0
    input_dict['aqi_rolling_7d_avg'] = base_lag - 8.0
    
    return pd.DataFrame([input_dict], columns=FEATURES)

def get_ensemble_prediction(df):
    xgb_pred = float(xgb_model.predict(df)[0])
    
    X_vals = df.values
    X_scaled = (X_vals - scaler['mean']) / (scaler['std'] + 1e-8)
    X_tensor = torch.tensor(X_scaled, dtype=torch.float32).unsqueeze(1)
    with torch.no_grad():
        lstm_pred = float(lstm_model(X_tensor).item())
        
    ensemble_pred = (lstm_pred * 0.6) + (xgb_pred * 0.4)
    return ensemble_pred, xgb_pred, lstm_pred

@app.post("/predict")
def predict_aqi(data: EnvironmentData):
    if xgb_model is None or lstm_model is None:
        raise HTTPException(status_code=500, detail="Models not loaded")

    input_df = prepare_advanced_features(data)
    ensemble_aqi, xgb_aqi, lstm_aqi = get_ensemble_prediction(input_df)
    
    shap_values = explainer(input_df)
    importance = {feature: float(val) for feature, val in zip(FEATURES, shap_values.values[0])}
    
    # --- B2B Financial Intervention Intelligence Engine ---
    interventions = []
    if ensemble_aqi > 100:
        if data.industrial_emissions > 50:
            sim_df = prepare_advanced_features(data)
            sim_df['industrial_emissions'] *= 0.85
            sim_aqi, _, _ = get_ensemble_prediction(sim_df)
            aqi_saved = round(ensemble_aqi - sim_aqi, 1)
            interventions.append({
                "action": "Reduce industrial output by 15%",
                "expected_aqi_reduction": aqi_saved,
                "confidence": "High",
                "impact_score": 92,
                "financial_savings_usd": int(aqi_saved * 5500) # $5.5k saved per AQI point in avoided regulatory fines
            })
            
        if data.traffic_density > 60:
            sim_df = prepare_advanced_features(data)
            sim_df['traffic_density'] *= 0.80
            sim_aqi, _, _ = get_ensemble_prediction(sim_df)
            aqi_saved = round(ensemble_aqi - sim_aqi, 1)
            interventions.append({
                "action": "Restrict heavy vehicle traffic",
                "expected_aqi_reduction": aqi_saved,
                "confidence": "Medium-High",
                "impact_score": 85,
                "financial_savings_usd": int(aqi_saved * 3200) # Healthcare/city budget savings
            })

    interventions = sorted(interventions, key=lambda x: x['impact_score'], reverse=True)

    # --- 7-Day Auto-Regressive Projection Engine ---
    forecast_7d = []
    current_aqi = ensemble_aqi
    sim_data = data.model_copy()
    
    for day in range(1, 8):
        # Simulate a severe weather stagnation event (thermal inversion building up)
        sim_data.temperature += 0.5
        sim_data.wind_speed = max(0.5, sim_data.wind_speed - 1.5) # Wind dying down causes accumulation
        sim_data.traffic_density = min(100.0, sim_data.traffic_density + 3.0)
        
        sim_df = prepare_advanced_features(sim_data)
        
        # Force the LSTM to recognize the auto-regressive trend
        sim_df['aqi_lag_1'] = current_aqi
        sim_df['aqi_lag_2'] = current_aqi * 0.95
        sim_df['aqi_rolling_7d_avg'] = current_aqi * 0.9
        
        day_aqi, _, _ = get_ensemble_prediction(sim_df)
        
        # Accumulation penalty for stagnant air (low wind)
        if sim_data.wind_speed < 5.0:
            day_aqi *= 1.15
            
        forecast_7d.append({
            "day": f"T+{day}",
            "aqi": round(day_aqi, 1)
        })
        current_aqi = day_aqi

    return {
        "predicted_aqi": round(ensemble_aqi, 1),
        "telemetry": {
            "xgboost_prediction": round(xgb_aqi, 1),
            "lstm_prediction": round(lstm_aqi, 1),
            "ensemble_weights": "LSTM: 60%, XGB: 40%"
        },
        "risk_level": "Hazardous" if ensemble_aqi > 250 else "High" if ensemble_aqi > 150 else "Moderate" if ensemble_aqi > 50 else "Good",
        "factors": importance,
        "recommended_interventions": interventions,
        "forecast_7d": forecast_7d
    }
