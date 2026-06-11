"use client";
import { useState, useEffect } from "react";
import Globe from "../../components/Globe";
import TopNavBar from "../../components/TopNavBar";
import AiCopilot from "../../components/AiCopilot";

export default function DigitalTwin() {
  const [activeLayer, setActiveLayer] = useState("base");
  const [year, setYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear((prev) => {
          if (prev >= 2035) {
            setIsPlaying(false);
            return 2035;
          }
          return prev + 1;
        });
      }, 500); // Scrub speed
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleLayerSelect = (layer: string) => {
    setActiveLayer(layer === activeLayer ? "base" : layer);
  };

  // Calculate dynamic metrics based on the timeline
  const popDensity = Math.round(42 + ((year - 2024) * 0.8));
  const co2Emissions = Math.round(415 + ((year - 2024) * 2.5));
  const sliderPercentage = ((year - 2010) / (2035 - 2010)) * 100;

  return (
    <div className="bg-background text-on-surface overflow-hidden h-screen w-screen relative font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* The Void: Background Base */}
      <div className="absolute inset-0 z-0 bg-[#050816] bg-grid-pattern opacity-60"></div>
      
      {/* Radial Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-nebula-violet/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-fixed-dim/5 rounded-full blur-[100px]"></div>
      </div>

      <TopNavBar />

      {/* MAIN VIEWPORT CANVAS: 3D GLOBE */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-[800px] h-[800px] rounded-full border border-surface-border/30 bg-surface-container-lowest/20 backdrop-blur-sm shadow-[0_0_100px_rgba(0,229,255,0.1)] flex items-center justify-center pointer-events-auto">
          {/* Simulated Globe Grid behind */}
          <div className="absolute inset-0 rounded-full border border-primary/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
          
          <Globe activeLayer={activeLayer} year={year} />

          {/* Crosshairs & Reticle */}
          <div className="absolute w-full h-[1px] bg-surface-border/40 pointer-events-none"></div>
          <div className="absolute h-full w-[1px] bg-surface-border/40 pointer-events-none"></div>
          <div className="absolute w-8 h-8 border border-primary/50 rounded-full animate-pulse-cyan pointer-events-none"></div>

          {/* Central Data Label */}
          <div className="absolute bottom-8 text-center text-on-surface-variant font-data-sm opacity-50 uppercase tracking-widest pointer-events-none">
            System: Online // Telemetry: Active
          </div>
        </div>
      </div>

      {/* LEFT PANEL: Layer Controls */}
      <div className="fixed left-6 top-32 z-40 w-72 flex flex-col gap-4">
        <div className="font-label-caps text-on-surface-variant mb-2 pl-2">
          MOD-L1 // ENVIRONMENTAL LAYERS
        </div>
        
        <div className="bg-surface-container/40 backdrop-blur-[20px] border border-surface-border rounded-xl p-5 shadow-lg">
          <div className="flex flex-col gap-2">
            {[
              { id: "temperature", icon: "thermostat", label: "Temperature", color: "text-primary", bg: "bg-primary" },
              { id: "fire", icon: "local_fire_department", label: "Wildfires", color: "text-warning-orange", bg: "bg-warning-orange" },
              { id: "water", icon: "water_drop", label: "Flood Risk", color: "text-primary-container", bg: "bg-primary-container" },
              { id: "carbon", icon: "forest", label: "Vegetation", color: "text-success-green", bg: "bg-success-green" },
              { id: "air", icon: "air", label: "Air Quality", color: "text-secondary", bg: "bg-secondary" },
            ].map((layer) => {
              const isActive = activeLayer === layer.id;
              return (
                <div 
                  key={layer.id}
                  onClick={() => handleLayerSelect(layer.id)}
                  className={`flex items-center justify-between group cursor-pointer p-2 rounded transition-colors ${isActive ? 'bg-surface-variant/50' : 'hover:bg-surface-variant/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${layer.color}`}>{layer.icon}</span>
                    <span className={`font-data-sm transition-colors ${isActive ? layer.color : 'text-on-surface'}`}>{layer.label}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative ${isActive ? `${layer.bg}/20` : 'bg-surface-variant'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${isActive ? `right-1 ${layer.bg} shadow-[0_0_8px_currentColor]` : 'left-1 bg-outline'}`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full h-[1px] bg-surface-border my-4"></div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-label-caps text-on-surface-variant">Global Opacity</span>
              <span className="font-data-sm text-primary">85%</span>
            </div>
            <div className="w-full h-1 bg-surface-variant rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-[85%] bg-primary rounded-full shadow-[0_0_5px_rgba(0,229,255,0.5)]"></div>
              <div className="absolute left-[85%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
            </div>
          </div>
        </div>

        {/* Telemetry Overlays */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-surface-container/20 backdrop-blur-3xl border border-surface-border/50 rounded-lg p-3 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary to-transparent opacity-50"></div>
            <div className="font-label-caps text-on-surface-variant mb-1">Pop Density</div>
            <div className="font-data-lg text-inverse-surface flex items-baseline gap-1">
              {popDensity}<span className="text-xs text-on-surface-variant">/km²</span>
            </div>
          </div>
          <div className="flex-1 bg-surface-container/20 backdrop-blur-3xl border border-surface-border/50 rounded-lg p-3 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-critical-red to-transparent opacity-50"></div>
            <div className="font-label-caps text-on-surface-variant mb-1">CO2 Emissions</div>
            <div className="font-data-lg text-critical-red flex items-baseline gap-1">
              {co2Emissions}<span className="text-xs text-on-surface-variant">ppm</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: AI Copilot */}
      <AiCopilot contextPrompt={`Analyze environmental conditions for the year ${year} with the active data layer: ${activeLayer}. Discuss global trends and localized anomalies.`} />

      {/* BOTTOM TIMELINE SLIDER */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[60%] max-w-4xl">
        <div className="bg-surface-container/40 backdrop-blur-2xl border border-surface-border rounded-xl px-6 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isPlaying ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-surface-variant/50 border-surface-border text-primary hover:bg-primary/20'}`}
            >
              <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
            
            <div className="flex-1 relative h-10 flex items-center group">
              <div className="absolute left-0 right-0 h-1 bg-surface-variant rounded-full"></div>
              <div 
                className="absolute left-0 h-1 bg-gradient-to-r from-secondary-container to-primary rounded-full shadow-[0_0_10px_rgba(0,229,255,0.4)] transition-all duration-300"
                style={{ width: `${sliderPercentage}%` }}
              ></div>
              
              <input 
                type="range" 
                min="2010" 
                max="2035" 
                value={year}
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  setIsPlaying(false); // Pause when user interacts manually
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-10"
              />
              
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-8 bg-surface-container border-2 border-primary rounded-sm shadow-[0_0_15px_rgba(0,229,255,0.6)] pointer-events-none group-hover:border-primary-fixed transition-all duration-300"
                style={{ left: `${sliderPercentage}%` }}
              >
                <div className="absolute inset-0 m-auto w-0.5 h-3 bg-primary/50 group-hover:bg-primary"></div>
              </div>
            </div>
            
            <div className="w-20 text-center font-data-lg text-primary tracking-widest border border-primary/30 bg-primary/5 rounded py-1 transition-all duration-300">
              {year}
            </div>
          </div>
          <div className="flex justify-between mt-2 font-label-caps text-on-surface-variant opacity-60">
            <span>2010</span>
            <span>PROJECTION MODE</span>
            <span>2035</span>
          </div>
        </div>
      </div>
    </div>
  );
}
