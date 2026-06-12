"use client";
import { useState, useEffect } from "react";
import TopNavBar from "../../components/TopNavBar";
import AiCopilot from "../../components/AiCopilot";

export default function SpaceWeather() {
  const [spaceData, setSpaceData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/space-data");
        const data = await res.json();
        setSpaceData(data);
      } catch (err) {
        console.error("Failed to fetch space weather:", err);
      }
    };
    fetchData();
  }, []);

  const todaysAsteroids = spaceData?.neos || [];
  
  const flares = spaceData?.space_weather?.solar_flares || [];
  const latestFlare = flares.length > 0 ? flares[0] : null;
  const cmes = spaceData?.space_weather?.coronal_mass_ejections || [];
  const activeCme = cmes.length > 0 ? cmes[0] : null;

  return (
    <div className="bg-background text-on-surface overflow-hidden h-screen w-screen relative font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Top NavBar */}
      <TopNavBar />

      {/* AI Copilot SideBar */}
      <AiCopilot contextPrompt="Analyze current space weather data and Near Earth Object trajectories to provide a specific 2-sentence threat assessment." />

      {/* The Void Background */}
      <div 
        className="absolute inset-0 z-0 bg-[#050816]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.1) 0%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'pulse-void 20s infinite alternate'
        }}
      ></div>

      {/* Main Content Canvas */}
      <main className="absolute inset-0 z-10 pt-32 pb-8 pl-8 pr-[360px] overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Grid: Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            {/* Holographic Sun */}
            <div className="glass-panel-elevated rounded-xl relative overflow-hidden group">
              <span className="absolute top-2 left-3 font-label-caps text-on-surface-variant/60">MOD-SUN-01</span>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity duration-700 group-hover:opacity-100 mix-blend-screen"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7XBu8CEF3WaK2VVEXPAzU7g5Hsvput7wKOiT80dGX6cTLiJPWx8WaN107OOuDYJHwwp2-fePEc1DjRr-be18LJHA2krkUNwdMEFOkrTuK9vBry5205WjZFGpeOpsFxyy-I-_9niCHvJwqHBQg-00kkP6F45BP7vytTswVara6P2JL7ioA7m_YjadEn87Lrl2Cg8G-mNXBlKXuYH6S8Sf246XzEjQL2J2zR2Q-iCP-rDU0QydyuEPBwbJTnJOYt4THgQ3lizuflyc')" }}
              ></div>
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="font-headline-lg text-[32px] text-primary">Solar Dynamics</h3>
                <p className="font-data-lg text-primary-fixed-dim">Real-time Coronal Mass Ejection Monitoring</p>
                {activeCme && (
                  <div className="mt-2 bg-warning-orange/20 border border-warning-orange/50 p-2 rounded text-warning-orange font-data-sm max-w-sm">
                    <span className="font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">warning</span> CME DETECTED</span>
                    <p className="text-[10px] mt-1">{activeCme.note}</p>
                  </div>
                )}
              </div>
              <div className="absolute top-4 right-4 text-right">
                <div className="font-data-sm text-on-surface">FLUX: {latestFlare ? latestFlare.classType : '1.4e-4 W/m²'}</div>
                <div className="font-data-sm text-warning-orange flex items-center justify-end gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-warning-orange animate-pulse-orange"></span> 
                  ACTIVE REGION {latestFlare ? latestFlare.activeRegionNum : '3615'}
                </div>
              </div>
            </div>

            {/* Orbital View */}
            <div className="glass-panel rounded-xl relative overflow-hidden">
              <span className="absolute top-2 left-3 font-label-caps text-on-surface-variant/60">MOD-ORBIT-02</span>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-screen"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbUN5D9oKB_y6Thm4B42DCueAbMxR_Zut0GRJfMKKYnBWGn6bWT0iSuHq3AYj5cwNWuQ_fzBuO7GUd-qmYjSXalgmcbL-8GY5MdHAnz-1LdHqNIYs2u-iD4fnxJNmAh126HULSv207iM_PCB23SAkZpjij8FGhqqajp6Ujc_NRkJ2MzHg9S3Vg2uQ0cUY-jpX-HOvxi_0A6gVop1NtE-1HVfQhG_jbjXbR-685xjQHy1sBeJ0i7l63htvT7QsFqdJvIKRmEpCKIuY')" }}
              ></div>
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="font-headline-md text-[24px] text-primary">Near-Earth Space</h3>
                <p className="font-data-sm text-on-surface-variant">Trajectory Intersection Analysis</p>
                <div className="mt-3 space-y-2">
                  {todaysAsteroids.slice(0, 3).map((neo: any, i: number) => (
                    <div key={i} className="text-[11px] font-mono text-white/90 bg-black/60 px-3 py-1.5 border-l-2 border-primary rounded flex justify-between w-64">
                      <span className="truncate">{neo.name}</span>
                      <span className={neo.hazard_level === 'HIGH' ? 'text-warning-orange animate-pulse font-bold' : 'text-success-green'}>
                        {neo.hazard_level === 'HIGH' ? 'HAZARD' : 'SAFE'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-lg p-5 relative">
              <span className="absolute top-2 left-3 font-label-caps text-on-surface-variant/60">DAT-FLR</span>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h4 className="font-body-lg text-on-surface">Solar Flares</h4>
                  <div className="font-display-lg text-[48px] text-primary mt-2">{latestFlare ? latestFlare.classType : 'M4.2'}</div>
                </div>
                <div className="bg-surface-variant/50 p-2 rounded-full"><span className="material-symbols-outlined text-primary">wb_sunny</span></div>
              </div>
              <div className="mt-4 h-12 w-full flex items-end gap-1 opacity-70">
                {[20, 40, 30, 70, 90, 50].map((h, i) => (
                  <div key={i} className={`w-1/6 rounded-t-sm ${h > 80 ? 'bg-warning-orange animate-pulse' : 'bg-primary/60'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-lg p-5 relative">
              <span className="absolute top-2 left-3 font-label-caps text-on-surface-variant/60">DAT-GEO</span>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h4 className="font-body-lg text-on-surface">Geomagnetic</h4>
                  <div className="font-display-lg text-[48px] text-warning-orange mt-2">G2</div>
                </div>
                <div className="bg-surface-variant/50 p-2 rounded-full"><span className="material-symbols-outlined text-warning-orange">public</span></div>
              </div>
              <p className="font-data-sm text-on-surface-variant mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning-orange animate-pulse-orange"></span> Moderate Storm in progress
              </p>
            </div>

            <div className="glass-panel rounded-lg p-5 relative">
              <span className="absolute top-2 left-3 font-label-caps text-on-surface-variant/60">DAT-AUR</span>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h4 className="font-body-lg text-on-surface">Aurora Forecast</h4>
                  <div className="font-display-lg text-[48px] text-success-green mt-2">Kp 5</div>
                </div>
                <div className="bg-surface-variant/50 p-2 rounded-full"><span className="material-symbols-outlined text-success-green">waves</span></div>
              </div>
              <p className="font-data-sm text-on-surface-variant mt-4">High probability at mid-latitudes.</p>
            </div>
          </div>

          {/* Asteroid Tracker List */}
          <div className="glass-panel rounded-xl p-5 relative">
            <span className="absolute top-2 left-3 font-label-caps text-on-surface-variant/60">SYS-AST-TRACK</span>
            <div className="mt-6 flex items-center justify-between border-b border-surface-border pb-4 mb-4">
              <h3 className="font-headline-md text-[24px] text-primary">Hazardous Object Telemetry</h3>
              <button className="font-label-caps text-primary px-3 py-1 border border-primary/30 rounded-full hover:bg-primary/10 transition-colors">FILTER</button>
            </div>
            
            <div className="space-y-2">
              {todaysAsteroids.length > 0 ? todaysAsteroids.slice(0, 5).map((ast: any, i: number) => {
                const isHazard = ast.hazard_level === "HIGH";
                const speed = (ast.velocity_kmh / 3600).toFixed(1); // Convert to km/s
                const diameter = Math.round(ast.estimated_diameter_max_m);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      const query = `Analyze the near-earth object ${ast.name}. It has a close approach on ${ast.close_approach_date}, speed of ${speed} km/s, and estimated diameter of ${diameter}m. Assess the hazard risk.`;
                      window.dispatchEvent(new CustomEvent('ai-query', { detail: query }));
                    }}
                    className="bg-surface-variant/20 hover:bg-surface-variant/40 transition-colors p-4 rounded-lg flex items-center justify-between border border-transparent hover:border-primary/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`material-symbols-outlined ${isHazard ? 'text-warning-orange' : 'text-primary-fixed-dim'}`}>
                        {isHazard ? 'emergency' : 'fiber_manual_record'}
                      </span>
                      <div>
                        <div className="font-data-lg text-on-surface">{ast.name.replace('(', '').replace(')', '')}</div>
                        <div className="font-data-sm text-on-surface-variant">Close: {ast.close_approach_date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-data-lg text-primary">{speed} km/s</div>
                      <div className="font-data-sm text-on-surface-variant">Relative Velocity</div>
                    </div>
                    <div className="text-right w-24">
                      <div className="font-data-lg text-on-surface">{diameter}m</div>
                      <div className="font-data-sm text-on-surface-variant">Est. Dia.</div>
                    </div>
                    {isHazard ? (
                      <div className="bg-warning-orange/10 border border-warning-orange/30 text-warning-orange font-label-caps px-2 py-1 rounded">HAZARD SCORE: 8.4</div>
                    ) : (
                      <div className="bg-primary/10 border border-primary/30 text-primary font-label-caps px-2 py-1 rounded">HAZARD SCORE: 2.1</div>
                    )}
                  </div>
                );
              }) : (
                <div className="text-on-surface-variant font-data-sm p-4">
                  {spaceData === null ? "Loading Near Earth Objects telemetry..." : "No Near Earth Objects currently tracked."}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
