import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Loader2 } from "lucide-react";
import { useCreateLink } from "@/hooks/use-links";
import { useToast } from "@/hooks/use-toast";

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
  const [name, setName] = useState("");
  const { mutate: createLink, isPending } = useCreateLink();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createLink(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast({
            title: "Trap Deployed",
            description: "New tracking link created successfully.",
          });
          setName("");
          onClose();
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card w-full max-w-md rounded-2xl border border-border/50 shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">Create Trap Link</h3>
                    <p className="text-xs text-muted-foreground">Generate a new honeypot URL</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1.5">
                      Target / Campaign Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. IRS Scammer - John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-medium text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || isPending}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Link"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
