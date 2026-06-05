import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import os
import pickle

# Feature set for the multivariate LSTM
FEATURES = [
    'temperature', 'humidity', 'wind_speed', 'traffic_density', 
    'industrial_emissions', 'green_cover_index', 'ndvi_satellite_index', 
    'day_of_week', 'is_weekend', 'aqi_lag_1', 'aqi_lag_2', 'aqi_lag_3', 'aqi_rolling_7d_avg'
]
TARGET = 'aqi'

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
        # We only want the last time step output
        out = self.fc(out[:, -1, :])
        return out

def train_lstm_model(data_path="data/demo_dataset.csv", model_path="models/lstm_aqi_model.pth", scaler_path="models/scaler.pkl"):
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    print("Loading data for LSTM...")
    df = pd.read_csv(data_path)
    
    X = df[FEATURES].values
    y = df[TARGET].values
    
    # Simple Standardization
    mean_X = np.mean(X, axis=0)
    std_X = np.std(X, axis=0)
    X_scaled = (X - mean_X) / (std_X + 1e-8)
    
    # Save scaler parameters for inference
    with open(scaler_path, 'wb') as f:
        pickle.dump({'mean': mean_X, 'std': std_X}, f)
        
    # Reshape for LSTM: (samples, time_steps, features)
    # Since we are doing a simplified sequence prediction for the MVP, we treat each row as a sequence of length 1 
    # (because the row already contains the temporal lags `aqi_lag_1`, etc.)
    X_tensor = torch.tensor(X_scaled, dtype=torch.float32).unsqueeze(1) 
    y_tensor = torch.tensor(y, dtype=torch.float32).unsqueeze(1)
    
    model = AQILSTM(input_size=len(FEATURES))
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    
    epochs = 150
    print(f"Training LSTM for {epochs} epochs...")
    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(X_tensor)
        loss = criterion(outputs, y_tensor)
        loss.backward()
        optimizer.step()
        
        if (epoch+1) % 50 == 0:
            print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}')
            
    # Calculate final RMSE
    model.eval()
    with torch.no_grad():
        preds = model(X_tensor).numpy()
        rmse = np.sqrt(np.mean((preds - y_tensor.numpy())**2))
        print(f"LSTM Training RMSE: {rmse:.2f}")

    torch.save(model.state_dict(), model_path)
    print(f"Successfully saved PyTorch LSTM weights to {model_path}")

if __name__ == "__main__":
    train_lstm_model()
