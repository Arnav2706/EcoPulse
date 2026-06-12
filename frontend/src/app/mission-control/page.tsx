"use client";
import { useState, useEffect } from "react";
import Map from "../../components/Map";
import TopNavBar from "../../components/TopNavBar";
import AiCopilot from "../../components/AiCopilot";

export default function MissionControl() {
  const [selectedCity, setSelectedCity] = useState("San Francisco");
  const [mlPrediction, setMlPrediction] = useState<any>(null);
  const [cvData, setCvData] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrediction = async () => {
      // Mock telemetry baseline for each city
      const CITY_DATA: any = {
        "San Francisco": { temperature: 18.0, humidity: 75.0, wind_speed: 15.0, traffic_density: 65.0, industrial_emissions: 30.0, green_cover_index: 45.0 },
        "New York": { temperature: 24.0, humidity: 60.0, wind_speed: 10.0, traffic_density: 85.0, industrial_emissions: 40.0, green_cover_index: 30.0 },
        "Tokyo": { temperature: 28.0, humidity: 70.0, wind_speed: 8.0, traffic_density: 80.0, industrial_emissions: 45.0, green_cover_index: 35.0 },
        "London": { temperature: 15.0, humidity: 80.0, wind_speed: 12.0, traffic_density: 75.0, industrial_emissions: 35.0, green_cover_index: 55.0 },
        "Sydney": { temperature: 22.0, humidity: 65.0, wind_speed: 18.0, traffic_density: 60.0, industrial_emissions: 25.0, green_cover_index: 50.0 }
      };

      const telemetry = CITY_DATA[selectedCity] || CITY_DATA["San Francisco"];

      try {
        const res = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: selectedCity, 
            ...telemetry
          })
        });
        setMlPrediction(await res.json());
      } catch (err) {
        console.error("Failed to fetch ML Prediction:", err);
      }
    };
    fetchPrediction();
  }, [selectedCity]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const cvRes = await fetch("http://localhost:8000/satellite-cv");
        setCvData(await cvRes.json());

        const misRes = await fetch("http://localhost:8000/missions");
        setMissions(await misRes.json());
      } catch (err) {
        console.error("Failed to fetch telemetry:", err);
      }
    };
    fetchTelemetry();
  }, []);

  return (
    <div className="bg-background text-on-surface overflow-hidden h-screen w-screen relative font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 bg-[#050816]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.15) 0%, transparent 60%)',
        }}
      ></div>

      <TopNavBar />
      <AiCopilot contextPrompt={`Analyze current environmental anomalies and telemetry for the target node: ${selectedCity}. Generate a highly specific 2-sentence tactical insight.`} />

      {/* Main Canvas */}
      <main className="absolute inset-0 z-10 pt-[100px] pb-[80px] pl-8 pr-[360px] flex flex-col gap-6 overflow-y-auto">
        
        {/* Central Visualization Area */}
        <section className="flex-grow bg-surface-container/40 backdrop-blur-[20px] border border-surface-border rounded-xl p-5 relative overflow-hidden min-h-[500px] flex">
          <div className="absolute top-4 left-4 font-label-caps text-outline z-20">MOD-NN-01 // XGBOOST SIMULATION ENGINE</div>
          
          <div className="w-1/3 flex flex-col z-20 mt-10 pr-4">
            <label className="font-label-caps text-on-surface-variant mb-2">TARGET NODE</label>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-surface-variant border border-surface-border rounded-md px-3 py-2 font-body-md text-on-surface focus:outline-none focus:border-primary w-full"
            >
              <option value="San Francisco">San Francisco (CA, USA)</option>
              <option value="New York">New York City (NY, USA)</option>
              <option value="Tokyo">Tokyo (Japan)</option>
              <option value="London">London (UK)</option>
              <option value="Sydney">Sydney (Australia)</option>
            </select>

            {mlPrediction && (
              <div className="mt-6 flex flex-col gap-4">
                <div className="bg-surface-container-highest/80 border border-primary/30 rounded-lg p-4">
                  <div className="font-label-caps text-primary">AQI ASSESSMENT</div>
                  <div className="font-display-lg text-[48px] text-warning-orange leading-tight">{mlPrediction.predicted_aqi.toFixed(1)}</div>
                  <div className="font-data-sm text-on-surface-variant mt-1">Simulated AQI</div>
                </div>
                
                <div className="bg-surface-container-highest/80 border border-surface-border rounded-lg p-4">
                  <div className="font-label-caps text-on-surface-variant mb-2">ML IMPACT ANALYSIS (SHAP)</div>
                  <div className="font-data-sm flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-on-surface">Temperature</span>
                    <span className="text-primary">{mlPrediction.factors.temperature.toFixed(2)}</span>
                  </div>
                  <div className="font-data-sm flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-on-surface">Humidity</span>
                    <span className="text-primary">{mlPrediction.factors.humidity.toFixed(2)}</span>
                  </div>
                  <div className="font-data-sm flex justify-between py-1 border-b border-surface-border/50">
                    <span className="text-on-surface">Wind Speed</span>
                    <span className="text-primary">{mlPrediction.factors.wind_speed.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-2/3 relative h-full flex items-center justify-center">
            {/* Map View */}
            <div className="absolute inset-0 z-10 p-2 pointer-events-auto">
              <Map city={selectedCity} aqi={mlPrediction?.predicted_aqi || 50} />
            </div>
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-primary/20 pointer-events-none z-20"></div>
            <div className="absolute h-full w-[1px] bg-primary/20 pointer-events-none z-20"></div>
            <div className="absolute w-12 h-12 border border-primary/50 rounded-full animate-pulse-cyan pointer-events-none z-20"></div>
          </div>
        </section>

        {/* Bottom Analytics Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
          
          <div className="bg-surface-container/40 backdrop-blur-[20px] border border-surface-border rounded-xl p-5 relative flex flex-col">
            <div className="absolute top-4 left-4 font-label-caps text-outline">SYS-METRICS // MISSIONS</div>
            <div className="mt-8 flex-grow overflow-y-auto">
              <div className="space-y-3">
                {missions.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-surface-border pb-2">
                    <div>
                      <div className="font-body-sm font-bold text-on-surface">{m.name}</div>
                      <div className="font-data-sm text-on-surface-variant">{m.agency}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-label-caps ${m.health > 80 ? 'text-success-green' : 'text-warning-orange'}`}>{m.status}</div>
                      <div className="font-data-sm text-primary">HLTH: {m.health}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container/55 backdrop-blur-[20px] border-[0.5px] border-primary/60 shadow-[inset_0_0_10px_rgba(0,229,255,0.1)] rounded-xl p-5 relative flex flex-col overflow-hidden">
            <div className="absolute top-4 left-4 font-label-caps text-primary z-10 bg-black/50 px-2 rounded">SATELLITE-CV</div>
            {cvData && (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
                  style={{ backgroundImage: `url('${cvData.image_url}')` }}
                ></div>
                <div className="mt-8 flex-grow flex flex-col justify-end z-10">
                  <div className="font-body-sm font-bold text-primary bg-black/50 p-1 inline-block rounded">{cvData.confidence} Confidence</div>
                  <div className="font-data-sm text-on-surface bg-black/50 p-2 mt-2 border-l-2 border-primary rounded">
                    {cvData.cv_analysis}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {cvData.detected_anomalies.map((a: string, i: number) => (
                      <span key={i} className="bg-warning-orange/20 text-warning-orange border border-warning-orange/50 font-label-caps px-2 py-1 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-surface-container/40 backdrop-blur-[20px] border border-surface-border rounded-xl p-5 relative flex flex-col">
            <div className="absolute top-4 left-4 font-label-caps text-outline">LOG-STREAM</div>
            <div className="mt-8 flex-grow font-data-sm text-on-surface-variant space-y-2 overflow-y-auto">
              <p>&gt; Agent Alpha: Target Acquired</p>
              <p>&gt; Sim Engine: Running iteration 492...</p>
              <p className="text-primary">&gt; Core: Sync complete.</p>
              <p>&gt; Orbit-04: Recalculating trajectory.</p>
              <p className="text-warning-orange">&gt; Alert: Minor latency spike detected.</p>
              <p>&gt; Auth: Handshake verified.</p>
              <p>&gt; LangGraph: Subagents standing by.</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
