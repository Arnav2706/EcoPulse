"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Sliders, Zap, MessageSquare, X, Send, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import("../../components/Map"), { ssr: false });

const forecastData = [
  { day: 'T+1', aqi: 150 },
  { day: 'T+2', aqi: 180 },
  { day: 'T+3', aqi: 240 },
  { day: 'T+4', aqi: 310 },
  { day: 'T+5', aqi: 380 },
  { day: 'T+6', aqi: 410 },
  { day: 'T+7', aqi: 432 },
];

export default function CommandCenter() {
  const [factors, setFactors] = useState({
    city: "Visakhapatnam",
    temperature: 32.0,
    humidity: 65.0,
    wind_speed: 12.0,
    traffic_density: 70.0,
    industrial_emissions: 60.0,
    green_cover_index: 40.0
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch prediction from FastAPI
  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(factors)
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Failed to fetch prediction:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrediction();
  }, [factors]);

  const handleSliderChange = (e: any) => {
    setFactors({ ...factors, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleCityChange = (e: any) => {
    setFactors({ ...factors, city: e.target.value });
  };

  // Copilot State
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "EcoPulse AI Copilot online. How can I assist with policy generation or environmental analysis today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleCopilotSubmit = (e: any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatHistory([...chatHistory, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Mock LLM Streaming response based on current data
    setTimeout(() => {
      const city = factors.city;
      const aqi = prediction?.predicted_aqi || 50;
      const risk = prediction?.risk_level || "Unknown";
      
      let aiResponse = "";
      const text = userMessage.content.toLowerCase();
      
      if (text.includes("report") || text.includes("policy")) {
        aiResponse = `**EXECUTIVE POLICY BRIEF: ${city.toUpperCase()}**\n\nBased on the current Deep Learning Ensemble forecast, the AQI is tracking at ${Math.round(aqi)} (${risk} Risk Level).\n\n**Key Directives:**\n1. Immediate enforcement of industrial emission throttling.\n2. Dispatch emergency respiratory alerts.\n3. Reroute heavy logistics.\n\nEstimated Financial ROI: High capability of avoiding massive compliance fines.`;
      } else if (text.includes("business") || text.includes("roi") || text.includes("pitch") || text.includes("money")) {
        aiResponse = `**EcoPulse AI Business Model:**\n\n1. **B2B (Enterprise):** Predictive Compliance. We sell licenses to Heavy Industries. By predicting bad AQI days, they throttle emissions *just* enough to avoid million-dollar government fines.\n\n2. **B2G (SaaS):** City Planners use our Digital Twin to simulate policy impacts before spending tax dollars.`;
      } else if (text.includes("tech") || text.includes("architecture") || text.includes("lstm") || text.includes("xgboost") || text.includes("how")) {
        aiResponse = `**Architecture Stack:**\n\nWe utilize a state-of-the-art **Deep Learning Ensemble**:\n- **PyTorch LSTM Node:** Learns from temporal lags and rolling 7-day averages.\n- **XGBoost Node:** Handles immediate non-linear relationships.\n- **SOTA Features:** We engineered a 365-day dataset including simulated Satellite NDVI and weather patterns.\n- **Backend:** FastAPI\n- **Frontend:** Next.js + Leaflet Maps`;
      } else if (text.includes("team") || text.includes("who")) {
        aiResponse = `EcoPulse AI was built by the **Neural Ninjas** to completely revolutionize Environmental Decision Intelligence.`;
      } else {
        aiResponse = `Analyzing current telemetry for ${city}... The XGBoost and LSTM nodes indicate a dominant impact from ${Object.keys(prediction?.factors || {})[0]?.replace(/_/g, " ")}. I recommend deploying the top intervention strategy immediately to mitigate risk.`;
      }

      setChatHistory(prev => [...prev, { role: "assistant", content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleDeployIntervention = (action: string) => {
    if (action.includes("industrial output")) {
      setFactors(prev => ({ ...prev, industrial_emissions: Math.max(0, prev.industrial_emissions * 0.85) }));
    } else if (action.includes("vehicle traffic")) {
      setFactors(prev => ({ ...prev, traffic_density: Math.max(0, prev.traffic_density * 0.80) }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden p-6 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[var(--color-neon-cyan)] opacity-[0.05] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[var(--color-neon-green)] opacity-[0.05] blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 glass-panel p-4 rounded-xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wider hover:drop-shadow-[0_0_10px_var(--color-neon-green)] transition-all cursor-pointer">
          <Activity className="text-[var(--color-neon-green)]" />
          <span>ECO<span className="text-[var(--color-neon-green)]">PULSE</span> COMMAND</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Global Node:</span>
          <select 
            value={factors.city} 
            onChange={handleCityChange}
            className="bg-black/50 border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] text-xs font-mono px-3 py-1.5 rounded outline-none focus:ring-1 focus:ring-[var(--color-neon-cyan)] uppercase tracking-widest cursor-pointer"
          >
            <option value="Visakhapatnam">Visakhapatnam, IND</option>
            <option value="New Delhi">New Delhi, IND</option>
            <option value="Mumbai">Mumbai, IND</option>
            <option value="Almaty">Almaty, KAZ</option>
            <option value="London">London, UK</option>
          </select>
          <div className="h-2 w-2 rounded-full bg-[var(--color-neon-green)] animate-pulse ml-2" />
        </div>
      </header>

      {/* Conditional Red Alert Banner */}
      {prediction?.predicted_aqi > 300 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-red-500 font-bold text-sm tracking-widest uppercase">Predicted Environmental Crisis Event</h2>
              <p className="text-gray-300 text-xs font-mono mt-1">
                XGBoost Ensemble projects AQI to hit 432 (Hazardous) within 7 days. Exceedance Probability: 98%.
              </p>
            </div>
          </div>
          <div className="bg-red-500/20 text-red-500 px-4 py-1.5 rounded text-xs font-bold font-mono border border-red-500/50">
            EMERGENCY PROTOCOL ACTIVE
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[85vh]">
        
        {/* Left Column: Digital Twin Simulator */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 rounded-xl flex flex-col gap-6 overflow-y-auto"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Sliders className="text-[var(--color-neon-cyan)]" />
            <h2 className="font-bold text-lg uppercase tracking-wider">Digital Twin Simulator</h2>
          </div>

          {[
            { name: "traffic_density", label: "Traffic Density", min: 0, max: 100 },
            { name: "industrial_emissions", label: "Industrial Emissions", min: 0, max: 100 },
            { name: "temperature", label: "Temperature (°C)", min: 10, max: 50 },
            { name: "wind_speed", label: "Wind Speed (km/h)", min: 0, max: 40 },
            { name: "humidity", label: "Humidity (%)", min: 0, max: 100 },
            { name: "green_cover_index", label: "Green Cover Index", min: 0, max: 100 },
          ].map((slider) => (
            <div key={slider.name} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-gray-400 font-mono">
                <span>{slider.label}</span>
                <span className="text-[var(--color-neon-cyan)]">{(factors as any)[slider.name]}</span>
              </div>
              <input 
                type="range" 
                name={slider.name} 
                min={slider.min} 
                max={slider.max} 
                value={(factors as any)[slider.name]} 
                onChange={handleSliderChange}
                className="w-full accent-[var(--color-neon-cyan)] cursor-pointer"
              />
            </div>
          ))}
        </motion.div>

        {/* Center Column: Map & Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          {/* Pollutant Pills */}
          <div className="flex flex-wrap gap-2 justify-between">
            {[
              { label: "PM2.5", val: "187.6", unit: "µg/m³", color: "text-red-500" },
              { label: "PM10", val: "298.4", unit: "µg/m³", color: "text-yellow-500" },
              { label: "NO2", val: "112.1", unit: "µg/m³", color: "text-yellow-500" },
              { label: "SO2", val: "52.8", unit: "µg/m³", color: "text-[var(--color-neon-cyan)]" },
              { label: "CO", val: "4.2", unit: "ppm", color: "text-[var(--color-neon-cyan)]" },
              { label: "O3", val: "38.1", unit: "µg/m³", color: "text-[var(--color-neon-cyan)]" },
            ].map(p => (
              <div key={p.label} className="glass-panel rounded px-3 py-1.5 flex items-center gap-2 text-xs flex-1 justify-center border border-[var(--color-neon-cyan)]/20 shadow-[0_0_10px_rgba(0,255,255,0.05)]">
                <span className="text-gray-500 font-mono text-[10px]">{p.label}</span>
                <span className={`font-bold font-mono ${p.color}`}>{p.val}</span>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="glass-panel rounded-xl h-[40%] relative overflow-hidden border-[var(--color-neon-green)]/20 border">
            <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1 rounded-md text-xs font-mono uppercase text-[var(--color-neon-green)] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--color-neon-green)] animate-pulse" />
              Live Satellite Overlay
            </div>
            <Map city={factors.city} aqi={prediction?.predicted_aqi || 50} />
          </div>

          {/* AI Forecast & Telemetry Overview */}
          <div className="glass-panel rounded-xl h-[60%] p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-[var(--color-neon-cyan)]/50 transition-colors">
            
            <div className="flex justify-between items-center z-10 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Ensemble Forecast (AQI)</h3>
                <div className={`text-5xl font-black ${
                  prediction?.predicted_aqi > 150 ? 'text-red-500 text-glow-red' : 
                  prediction?.predicted_aqi > 100 ? 'text-yellow-500' : 'text-[var(--color-neon-green)] text-glow-green'
                }`}>
                  {loading ? "..." : prediction?.predicted_aqi}
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-xs font-mono w-max">
                    Risk: <span className="text-white ml-1">{prediction?.risk_level}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-xs font-mono w-max">
                    Est. Carbon: <span className="text-white ml-1">{loading ? "..." : Math.round((prediction?.predicted_aqi || 50) * 14.2).toLocaleString()} MT</span>
                  </div>
                </div>
              </div>

              {/* Advanced ML Telemetry */}
              <div className="text-right flex flex-col gap-1 text-xs font-mono text-gray-400">
                <span className="text-[var(--color-neon-cyan)]">LIVE TELEMETRY</span>
                <div className="flex justify-between gap-4">
                  <span>LSTM Node:</span>
                  <span className="text-white">{prediction?.telemetry?.lstm_prediction}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>XGBoost Node:</span>
                  <span className="text-white">{prediction?.telemetry?.xgboost_prediction}</span>
                </div>
                <div className="mt-1 border-t border-white/20 pt-1 flex justify-between gap-4">
                  <span>Weights:</span>
                  <span className="text-[var(--color-neon-green)]">{prediction?.telemetry?.ensemble_weights}</span>
                </div>
              </div>
            </div>

            {/* Split SHAP and 7-Day Chart */}
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden mt-2">
              {/* SHAP Chart */}
              <div className="z-10 w-full flex flex-col gap-3 overflow-y-auto pr-2 pb-2">
                <h4 className="text-[10px] text-[var(--color-neon-cyan)] tracking-widest uppercase font-mono mb-1">Explainable AI (SHAP Impact)</h4>
                {prediction && Object.entries(prediction.factors)
                  .sort((a: any, b: any) => Math.abs(b[1]) - Math.abs(a[1]))
                  .slice(0, 4)
                  .map(([feat, val]: any) => (
                  <div key={feat} className="flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{feat.replace(/_/g, " ").toUpperCase()}</span>
                      <span className={val > 0 ? "text-red-400 font-bold" : "text-[var(--color-neon-green)] font-bold"}>
                        {val > 0 ? "+" : ""}{val.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${val > 0 ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-[var(--color-neon-green)] shadow-[0_0_5px_var(--color-neon-green)]'}`} 
                        style={{ width: `${Math.min(Math.abs(val) * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 7-Day Area Chart */}
              <div className="z-10 w-full flex flex-col h-full border-l border-white/10 pl-4">
                <h4 className="text-[10px] text-[var(--color-neon-cyan)] tracking-widest uppercase font-mono mb-2">7-Day Risk Projection</h4>
                <div className="flex-1 w-full min-h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-neon-cyan)" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="var(--color-neon-cyan)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} domain={[100, 500]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'var(--color-neon-cyan)', borderRadius: '8px' }} 
                        itemStyle={{ color: 'var(--color-neon-cyan)', fontWeight: 'bold' }} 
                      />
                      <Area type="monotone" dataKey="aqi" stroke="var(--color-neon-cyan)" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Intervention Intelligence */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 rounded-xl flex flex-col gap-4 border-[var(--color-neon-green)]/30 border relative overflow-hidden"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-neon-green)] to-transparent opacity-50" />
           
           <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Zap className="text-[var(--color-neon-green)]" />
            <h2 className="font-bold text-lg uppercase tracking-wider">Intervention Engine</h2>
          </div>

          <p className="text-sm text-gray-400">
            Autonomous AI recommendations to prevent forecasted environmental crises.
          </p>

          <div className="flex flex-col gap-4 mt-2 overflow-y-auto">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                 <div className="h-24 bg-white/5 rounded-lg w-full" />
                 <div className="h-24 bg-white/5 rounded-lg w-full" />
              </div>
            ) : prediction?.recommended_interventions?.length > 0 ? (
              prediction.recommended_interventions.map((intervention: any, idx: number) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-[var(--color-neon-green)]/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[var(--color-neon-green)] text-sm">{intervention.action}</h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded font-mono">Score: {intervention.impact_score}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span>Expected AQI Drop:</span>
                      <span className="text-[var(--color-neon-cyan)]">-{intervention.expected_aqi_reduction} pts</span>
                    </div>
                    {intervention.financial_savings_usd && (
                    <div className="flex justify-between font-bold">
                      <span>Est. ROI (Fines Avoided):</span>
                      <span className="text-[var(--color-neon-green)]">${intervention.financial_savings_usd.toLocaleString()}</span>
                    </div>
                    )}
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span>{intervention.confidence}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeployIntervention(intervention.action)}
                    className="mt-3 w-full py-1.5 bg-white/10 hover:bg-[var(--color-neon-green)] hover:text-black transition-colors rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Deploy Action
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center p-8 border border-white/10 rounded-lg bg-white/5">
                <ShieldAlert className="mx-auto mb-2 text-gray-500" />
                <span className="text-sm text-gray-500">Conditions Optimal. No interventions required.</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating Copilot Button */}
      <button 
        onClick={() => setCopilotOpen(true)}
        className="absolute bottom-6 right-6 h-14 w-14 bg-[var(--color-neon-cyan)] text-black rounded-full shadow-[0_0_20px_var(--color-neon-cyan)] flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Copilot Chat Panel */}
      {copilotOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-24 right-6 w-96 h-[500px] bg-black/90 backdrop-blur-xl border border-[var(--color-neon-cyan)]/50 rounded-xl shadow-[0_0_40px_rgba(0,255,255,0.15)] flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[var(--color-neon-cyan)]/10">
            <div className="flex items-center gap-2 text-[var(--color-neon-cyan)] font-bold">
              <Zap className="w-4 h-4" />
              <span>EcoPulse Copilot</span>
            </div>
            <button onClick={() => setCopilotOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-sm font-mono">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-white/10 text-white rounded-br-none border border-white/20' 
                    : 'bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] rounded-bl-none border border-[var(--color-neon-cyan)]/30'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>{line}<br/></span>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)] p-3 rounded-lg rounded-bl-none border border-[var(--color-neon-cyan)]/30 flex gap-1">
                  <span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleCopilotSubmit} className="p-4 border-t border-white/10 flex gap-2 bg-black/50">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g. Generate policy report..."
              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon-cyan)] font-mono"
            />
            <button type="submit" className="bg-[var(--color-neon-cyan)] text-black p-2 rounded hover:brightness-110 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
