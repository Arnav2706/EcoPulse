"use client";
import { useState, useEffect } from "react";

export default function AiCopilot({ contextPrompt }: { contextPrompt?: string }) {
  const [chatLog, setChatLog] = useState<{role: string, text: string}[]>([
    { role: "system", text: "AI Copilot synchronized. Awaiting mission parameters..." }
  ]);
  const [chatInput, setChatInput] = useState("");

  const [activeTab, setActiveTab] = useState<"chat" | "streams">("chat");
  const [streamData, setStreamData] = useState({ temp: 15.2, co2: 421.5, latency: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamData(prev => ({
        temp: prev.temp + (Math.random() * 0.2 - 0.1),
        co2: prev.co2 + (Math.random() * 0.4 - 0.2),
        latency: Math.floor(Math.random() * 20) + 30
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const submitChat = async (overrideText?: string | any) => {
    let textToSubmit = typeof overrideText === 'string' ? overrideText : chatInput;
    if (!textToSubmit || !textToSubmit.trim()) {
      textToSubmit = contextPrompt || "Analyze the current global environmental data streams and generate a key insight.";
    }
    
    const userText = textToSubmit.trim();
    setChatLog(prev => [...prev, { role: "user", text: userText }]);
    
    if (chatInput.trim() === userText) {
      setChatInput("");
    }
    
    // Switch back to chat tab to see the response
    setActiveTab("chat");
    setChatLog(prev => [...prev, { role: "system", text: "Processing query through LangGraph swarm..." }]);

    try {
      const res = await fetch("http://localhost:8000/mission-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText })
      });
      const data = await res.json();
      setChatLog(prev => [...prev, { role: "system", text: data.report || "No report generated." }]);
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { role: "system", text: "Connection to Swarm Core failed." }]);
    }
  };

  useEffect(() => {
    const handleAiQuery = (e: any) => {
      if (e.detail) {
        submitChat(e.detail);
      }
    };
    window.addEventListener('ai-query', handleAiQuery);
    return () => window.removeEventListener('ai-query', handleAiQuery);
  }, []);

  return (
    <aside className="bg-surface-container-lowest/60 backdrop-blur-2xl border-l border-surface-border shadow-[inset_0_0_20px_rgba(0,229,255,0.05)] transition-transform duration-500 ease-in-out flex flex-col p-5 z-40 h-[calc(100vh-120px)] w-80 fixed right-4 top-24 rounded-xl">
      <div className="flex items-center gap-4 mb-6 border-b border-surface-border pb-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center relative">
          <span className="material-symbols-outlined text-primary">psychology</span>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success-green rounded-full border border-surface-container-lowest"></div>
        </div>
        <div>
          <h2 className="font-headline-md text-[18px]">AI Copilot</h2>
          <div className="font-data-sm text-primary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-cyan"></span>
            Status: Synchronized
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <button 
          onClick={() => setActiveTab("chat")}
          className={`font-data-sm flex items-center gap-3 py-2 px-3 rounded-l transition-colors ${activeTab === 'chat' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-surface-variant/30 border-r-4 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          AI Chat
        </button>
        <button 
          onClick={() => setActiveTab("streams")}
          className={`font-data-sm flex items-center gap-3 py-2 px-3 rounded-l transition-colors ${activeTab === 'streams' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-on-surface-variant hover:bg-surface-variant/30 border-r-4 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-[20px]">sensors</span>
          Data Streams
        </button>
      </div>

      {activeTab === "chat" ? (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4 pr-2">
          {chatLog.map((msg, i) => (
            <div key={i} className={`border rounded-lg p-3 max-w-[90%] ${msg.role === 'system' ? 'bg-surface-container/50 border-surface-border self-start' : 'bg-surface-variant/50 border-surface-border self-end'}`}>
              {msg.role === 'system' && <div className="font-label-caps text-primary mb-1">System Insight</div>}
              <p className="font-body-sm text-on-surface-variant">{msg.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4 pr-2">
          <div className="border rounded-lg p-3 bg-surface-container/50 border-surface-border">
            <div className="font-label-caps text-secondary mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Live Telemetry</div>
            <div className="font-data-sm text-on-surface-variant flex flex-col gap-1">
              <div className="flex justify-between"><span>Global Avg Temp:</span> <span className="text-primary">{streamData.temp.toFixed(2)}°C</span></div>
              <div className="flex justify-between"><span>CO2 PPM:</span> <span className="text-warning-orange">{streamData.co2.toFixed(1)}</span></div>
              <div className="flex justify-between"><span>Active Wildfires:</span> <span className="text-error">12</span></div>
              <div className="flex justify-between"><span>Sea Level Anomaly:</span> <span className="text-primary-container">+3.4mm</span></div>
            </div>
          </div>
          <div className="border rounded-lg p-3 bg-surface-container/50 border-surface-border">
            <div className="font-label-caps text-success-green mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span> Sensor Network</div>
            <div className="font-data-sm text-on-surface-variant flex flex-col gap-1">
              <div className="flex justify-between"><span>Satellites Active:</span> <span>42/45</span></div>
              <div className="flex justify-between"><span>Ground Stations:</span> <span>104/104</span></div>
              <div className="flex justify-between"><span>Data Latency:</span> <span>{streamData.latency}ms</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <div className="relative">
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitChat()}
            className="w-full bg-surface-container border border-surface-border rounded-md py-2 px-3 font-data-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
            placeholder="Query simulation data..." 
          />
          <button onClick={submitChat} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-fixed">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
        <button onClick={submitChat} className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-black font-label-caps py-3 rounded-md transition-all duration-300 backdrop-blur-md">
          Generate Insight
        </button>
      </div>
    </aside>
  );
}
