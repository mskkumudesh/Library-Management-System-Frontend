import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerViewProps {
  onScan: (decodedText: string) => void;
  active: boolean;
}

const ELEMENT_ID = "shelfscan-camera-view";

export default function ScannerView({ onScan, active }: ScannerViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    // Tracks whether the scanner is actually in a running state, so we never
    // call stop() on a scanner that's already stopped (html5-qrcode throws
    // synchronously in that case).
    let isRunning = false;

    // Defensive: in React 18 Strict Mode (dev only), effects mount twice in a
    // row. If the previous instance's async stop()/clear() hasn't finished
    // yet, its <video> element can still be sitting in the container when we
    // start a new instance here — wipe it synchronously so we never end up
    // with two overlapping camera feeds.
    const container = document.getElementById(ELEMENT_ID);
    if (container) container.innerHTML = "";

    const scanner = new Html5Qrcode(ELEMENT_ID);
    setStarting(true);
    setError(null);

    const safeStop = () => {
      if (!isRunning) return Promise.resolve();
      isRunning = false;
      try {
        return scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {
            // already stopped/cleared — safe to ignore
          });
      } catch {
        return Promise.resolve();
      }
    };

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          if (cancelled || !isRunning) return;
          // Stop the camera before handing control back to the parent —
          // avoids the parent unmounting us mid-stop.
          safeStop().finally(() => {
            if (!cancelled) onScan(decodedText);
          });
        },
        () => {
          // per-frame "no code found" callback — intentionally ignored, fires constantly
        }
      )
      .then(() => {
        if (!cancelled) isRunning = true;
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            "Couldn't access the camera. Check browser permissions, or use manual entry below."
          );
          console.error(err);
        }
      })
      .finally(() => {
        if (!cancelled) setStarting(false);
      });

    return () => {
      cancelled = true;
      safeStop();
    };
  }, [active, onScan]);

  if (!active) return null;

  return (
    <div className="rounded-lg overflow-hidden border border-ink/10 bg-black">
      {starting && <p className="text-white text-sm p-3">Starting camera…</p>}
      {error && <p className="text-red-300 text-sm p-3 bg-red-900/40">{error}</p>}
      <div id={ELEMENT_ID} className="w-full" />
    </div>
  );
}
