"use client";

export default function Footer() {
  return (
    <footer className="w-full absolute bottom-0 z-50 bg-surface-container-low/20 backdrop-blur-md border-t border-surface-border/50 px-8 py-3 flex flex-col md:flex-row justify-between items-center">
      <div className="font-headline-md text-[14px] uppercase tracking-widest text-on-surface opacity-80 hover:opacity-100 transition-opacity">
        EcoPulse Space Intelligence
      </div>
      <div className="font-label-caps text-[10px] text-secondary-fixed-dim text-center my-2 md:my-0">
        © 2024 EcoPulse Space Intelligence. Protecting Earth Through Space Intelligence.
      </div>
      <div className="flex gap-6 font-label-caps text-[10px]">
        <a className="text-on-surface-variant hover:text-success-green transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
        <a className="text-on-surface-variant hover:text-success-green transition-colors opacity-80 hover:opacity-100" href="#">Security Protocol</a>
        <a className="text-on-surface-variant hover:text-success-green transition-colors opacity-80 hover:opacity-100" href="#">Contact Command</a>
      </div>
    </footer>
  );
}
