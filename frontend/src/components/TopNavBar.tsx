"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-surface-container/40 backdrop-blur-xl rounded-full mt-4 mx-auto max-w-7xl border border-surface-border shadow-2xl shadow-neon-cyan-glow/20 animate-fade-up">
      <div className="font-display-lg text-[24px] md:text-[32px] tracking-tighter text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
        EcoPulse <span className="text-white">Space</span>
      </div>
        <nav className="hidden md:flex gap-6 font-headline-md font-label-caps">
          <Link href="/" className={`font-medium transition-all duration-300 scale-95 active:scale-90 ${pathname === '/' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Home</Link>
          <Link href="/digital-twin" className={`font-medium transition-all duration-300 scale-95 active:scale-90 ${pathname === '/digital-twin' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Digital Twin</Link>
          <Link href="/space-weather" className={`font-medium transition-all duration-300 scale-95 active:scale-90 ${pathname === '/space-weather' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Space Weather</Link>
          <Link href="/mission-control" className={`font-medium transition-all duration-300 scale-95 active:scale-90 ${pathname === '/mission-control' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Mission Control</Link>
          <Link href="/aether-control" className={`font-medium transition-all duration-300 scale-95 active:scale-90 ${pathname === '/aether-control' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}>Aether Swarm</Link>
        </nav>
      <div className="flex items-center gap-4 text-primary">
        <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">account_circle</span>
        <span className="material-symbols-outlined cursor-pointer hover:text-white transition-colors">settings</span>
      </div>
    </nav>
  );
}
