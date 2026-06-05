import pandas as pd
import numpy as np
import xgboost as xgb
import pickle
import os

def train_and_save_model(data_path="data/demo_dataset.csv", model_path="models/xgb_aqi_model.pkl"):
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    print("Loading data...")
    df = pd.read_csv(data_path)
    
    # We want to predict AQI using environmental factors
    features = [
        'temperature', 'humidity', 'wind_speed', 'traffic_density', 
        'industrial_emissions', 'green_cover_index', 'ndvi_satellite_index', 
        'day_of_week', 'is_weekend', 'aqi_lag_1', 'aqi_lag_2', 'aqi_lag_3', 'aqi_rolling_7d_avg'
    ]
    target = 'aqi'
    
    X = df[features]
    y = df[target]
    
    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror', 
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    
    model.fit(X, y)
    
    # Evaluate simply
    from sklearn.metrics import mean_squared_error
    preds = model.predict(X)
    rmse = np.sqrt(mean_squared_error(y, preds))
    print(f"Training RMSE: {rmse:.2f}")
    
    # Save the model
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Successfully saved model to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
