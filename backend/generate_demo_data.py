import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_air_quality_data(filepath="data/demo_dataset.csv", days=365):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Generate dates for the past N days (increased to 365 for Deep Learning)
    end_date = datetime.now()
    dates = [end_date - timedelta(days=i) for i in range(days)]
    dates.reverse()

    np.random.seed(42)
    
    # Base features
    data = {
        'date': dates,
        'temperature': np.random.normal(loc=32.0, scale=4.0, size=days), 
        'humidity': np.random.normal(loc=65.0, scale=10.0, size=days), 
        'wind_speed': np.random.normal(loc=12.0, scale=5.0, size=days), 
        'traffic_density': np.random.normal(loc=70.0, scale=15.0, size=days), 
        'industrial_emissions': np.random.normal(loc=60.0, scale=20.0, size=days), 
        'green_cover_index': np.random.normal(loc=40.0, scale=5.0, size=days),
        # Advanced SOTA Features
        'ndvi_satellite_index': np.random.uniform(0.2, 0.8, size=days), # NDVI Proxy
        'day_of_week': [d.weekday() for d in dates],
        'is_weekend': [1 if d.weekday() >= 5 else 0 for d in dates]
    }

    df = pd.DataFrame(data)

    df['traffic_density'] = df['traffic_density'].clip(0, 100)
    df['industrial_emissions'] = df['industrial_emissions'].clip(0, 100)
    df['wind_speed'] = df['wind_speed'].clip(1, 40)

    # Base AQI Calculation
    base_aqi = 50
    df['aqi'] = (
        base_aqi + 
        (df['traffic_density'] * 1.5) + 
        (df['industrial_emissions'] * 2.0) - 
        (df['wind_speed'] * 2.5) +
        (df['temperature'] * 0.5) -
        (df['ndvi_satellite_index'] * 30.0) # More vegetation = lower AQI
    )
    
    df['aqi'] += np.random.normal(0, 10, size=days)
    df['aqi'] = df['aqi'].clip(20, 500)
    
    # Inject cyclical patterns (higher traffic on weekdays)
    df.loc[df['is_weekend'] == 0, 'aqi'] += 15
    
    # Create Lag Features for Deep Learning
    df['aqi_lag_1'] = df['aqi'].shift(1).fillna(df['aqi'].mean())
    df['aqi_lag_2'] = df['aqi'].shift(2).fillna(df['aqi'].mean())
    df['aqi_lag_3'] = df['aqi'].shift(3).fillna(df['aqi'].mean())
    df['aqi_rolling_7d_avg'] = df['aqi'].rolling(window=7, min_periods=1).mean()

    # The Visakhapatnam narrative event in the last 7 days
    df.loc[days-7:, 'industrial_emissions'] += 35
    df.loc[days-7:, 'traffic_density'] += 25
    df.loc[days-7:, 'wind_speed'] -= 8
    df.loc[days-7:, 'ndvi_satellite_index'] -= 0.1 # Simulated deforestation/fire
    df.loc[days-7:, 'aqi'] += 120 
    
    df['aqi'] = df['aqi'].clip(20, 500)
    
    df.to_csv(filepath, index=False)
    print(f"Successfully generated advanced demo dataset with {days} records at {filepath}")

if __name__ == "__main__":
    generate_air_quality_data()
