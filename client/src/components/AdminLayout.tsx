import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShieldAlert, Radar, List, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background aesthetic grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0"></div>
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>

      <nav className="relative z-10 glass-panel border-t-0 border-x-0 border-b border-border/40 mb-8 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldAlert className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-display">
                  SPAMMER PAYBACK
                </h1>
                <p className="text-xs text-primary font-mono font-medium tracking-widest uppercase">Admin Terminal_</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  location === "/" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <List className="w-4 h-4" />
                All Links
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
