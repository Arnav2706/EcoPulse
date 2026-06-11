"use client";
import Link from "next/link";
import NebulaShader from "../components/NebulaShader";
import TopNavBar from "../components/TopNavBar";
import Footer from "../components/Footer";
import Globe from "../components/Globe";

export default function LandingPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-on-surface">
      <NebulaShader />
      <TopNavBar />

      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-24 pb-16 px-6">
        {/* Central 3D Earth */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-80 mix-blend-screen">
          <div className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] object-contain">
            <Globe activeLayer="base" />
          </div>
        </div>

        {/* Hero Typography & CTAs */}
        <div className="relative z-20 text-center flex flex-col items-center max-w-4xl mx-auto mt-12 pointer-events-none">
          <h1 className="font-display-lg text-[64px] md:text-[88px] leading-none tracking-tighter text-white mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] animate-fade-up delay-100">
            EcoPulse Space
          </h1>
          <p className="font-headline-md text-[24px] text-primary-fixed-dim max-w-2xl mb-10 opacity-90 animate-fade-up delay-200">
            Autonomous Earth Digital Twin & Space Intelligence Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-up delay-300 pointer-events-auto">
            <Link href="/digital-twin" className="bg-primary text-black font-label-caps px-8 py-4 rounded-md uppercase tracking-widest hover:bg-white transition-all duration-300 neon-box-glow active:scale-95 flex items-center gap-2">
              <span>Explore Earth</span>
              <span className="material-symbols-outlined text-sm">travel_explore</span>
            </Link>
            <Link href="/mission-control" className="bg-transparent border border-primary text-primary font-label-caps px-8 py-4 rounded-md uppercase tracking-widest hover:bg-primary/10 transition-all duration-300 backdrop-blur-md active:scale-95 flex items-center gap-2">
              <span>Launch Mission Control</span>
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
            </Link>
          </div>
        </div>

        {/* Floating HUD Elements */}
        <div className="absolute bottom-32 left-8 md:left-16 z-20 animate-fade-up delay-400">
          <div className="glass-panel-elevated p-4 rounded-lg w-64">
            <div className="flex justify-between items-center mb-3">
              <span className="font-data-sm text-on-surface-variant uppercase">Telemetry</span>
              <div className="status-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-sans text-[14px] text-on-surface-variant">Orbital Alt</span>
                <span className="font-data-lg text-primary">408.5 km</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-[14px] text-on-surface-variant">Velocity</span>
                <span className="font-data-lg text-primary">7.66 km/s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-48 right-8 md:right-16 z-20 animate-fade-up delay-400 hidden lg:block">
          <div className="glass-panel p-4 rounded-lg w-56">
            <div className="font-data-sm text-primary mb-2 uppercase tracking-widest">Sys Status</div>
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-success-green">check_circle</span>
              <span className="font-sans text-[14px] text-white">Core Systems Nominal</span>
            </div>
            <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
              <div className="bg-success-green h-full w-full"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
