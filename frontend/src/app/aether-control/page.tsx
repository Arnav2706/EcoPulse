"use client";
import { useState, useRef, useEffect } from "react";
import TopNavBar from "../../components/TopNavBar";

export default function AetherControl() {
  const [chatLog, setChatLog] = useState<{role: string, text: string}[]>([
    { role: "system", text: "Aether Control online. LangGraph Swarm ready for multi-agent coordination." },
    { role: "system", text: "Available Agents: Mission Commander, Astrodynamics Expert, Climate Data Analyst." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const submitChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatLog(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/mission-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText })
      });
      const data = await res.json();
      setChatLog(prev => [...prev, { role: "assistant", text: data.report || "No report generated." }]);
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { role: "assistant", text: "Connection to Swarm Core failed. Check backend status." }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="bg-background text-on-surface overflow-hidden h-screen w-screen relative font-body-md selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 bg-[#050816]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.15) 0%, transparent 60%)',
        }}
      ></div>

      <TopNavBar />

      {/* Main Chat Interface */}
      <main className="relative z-10 flex-grow min-h-0 flex items-center justify-center pt-24 pb-8 px-8">
        <div className="w-full max-w-5xl h-full min-h-0 bg-surface-container/40 backdrop-blur-3xl border border-surface-border rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,229,255,0.05)] overflow-hidden">
          
          {/* Header */}
          <div className="border-b border-surface-border/50 p-6 flex items-center justify-between bg-surface-container-highest/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container border border-primary/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <span className="material-symbols-outlined text-primary text-[28px]">hub</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-green rounded-full border-2 border-surface-container-lowest"></div>
              </div>
              <div>
                <h2 className="font-headline-lg text-primary">Aether Control</h2>
                <div className="font-data-sm text-primary flex items-center gap-2 tracking-widest mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse-cyan"></span>
                  LANGGRAPH SWARM UPLINK ESTABLISHED
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 border border-primary/30 rounded px-3 py-1 font-label-caps text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">memory</span> MULTI-AGENT MODE
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-grow min-h-0 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl p-5 ${
                    msg.role === 'user' 
                      ? 'bg-primary/10 border border-primary/30 text-on-surface' 
                      : 'bg-surface-variant/40 border border-surface-border text-inverse-surface'
                  }`}
                >
                  {msg.role !== 'user' && (
                    <div className="flex items-center gap-2 mb-2 font-label-caps text-primary border-b border-surface-border/50 pb-2">
                      <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                      {msg.role === 'system' ? 'SYSTEM DIAGNOSTIC' : 'SWARM RESPONSE'}
                    </div>
                  )}
                  <div className="font-body-md whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-5 bg-surface-variant/40 border border-surface-border text-inverse-surface flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="font-data-sm text-on-surface-variant">Swarm agents are coordinating...</span>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-surface-container-highest/30 border-t border-surface-border/50">
            <div className="relative">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitChat()}
                className="w-full bg-surface-container border border-surface-border rounded-xl py-4 pl-6 pr-16 font-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]" 
                placeholder="Transmit parameters to Swarm..." 
                disabled={isTyping}
              />
              <button 
                onClick={submitChat} 
                disabled={isTyping || !chatInput.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary hover:bg-primary-fixed text-on-primary rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
