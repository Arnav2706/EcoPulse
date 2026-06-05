"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldAlert, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-neon-green)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-neon-cyan)] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full fixed top-0 z-50 glass-panel border-b-0 border-white/5 px-6 py-4 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 font-bold text-xl tracking-wider"
        >
          <Activity className="text-[var(--color-neon-green)]" />
          <span>ECO<span className="text-[var(--color-neon-green)]">PULSE</span> AI</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/command-center" className="px-6 py-2 rounded-full border border-[var(--color-neon-green)] text-[var(--color-neon-green)] hover:bg-[var(--color-neon-green)] hover:text-black transition-all font-semibold uppercase tracking-widest text-sm">
            Launch Command Center
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-[var(--color-neon-cyan)]/30 text-[var(--color-neon-cyan)] text-sm font-mono tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] animate-pulse" />
            AUTONOMOUS ENVIRONMENTAL INTELLIGENCE
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight uppercase">
            Predict. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-neon-cyan)]">Explain.</span> <br />
            Prevent.
          </h1>
          
          <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mb-12 font-light">
            An AI Copilot for Governments. Predict environmental risks, simulate outcomes, and deploy optimal interventions before crises occur.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/command-center" className="group relative px-8 py-4 bg-[var(--color-neon-green)] text-black font-bold text-lg rounded-none uppercase tracking-widest overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Enter Platform <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Showcase */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Risk Forecasting", icon: <ShieldAlert />, desc: "High-precision XGBoost models predicting AQI & hotspots 30 days out." },
            { title: "Intervention Engine", icon: <Zap />, desc: "Simulate policy impacts and get optimized, AI-generated action plans." },
            { title: "Digital Twin", icon: <Globe />, desc: "Test environmental scenarios on a live simulation layer." }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-8 hover:border-[var(--color-neon-green)]/50 transition-colors group cursor-pointer"
            >
              <div className="text-[var(--color-neon-green)] w-12 h-12 mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
