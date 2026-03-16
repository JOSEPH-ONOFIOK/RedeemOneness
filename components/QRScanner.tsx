"use client";
import { useState, useEffect } from "react";

export default function QRScanner({
  onScan,
  onError,
}: {
  onScan: (value: string) => void;
  onError?: (err: string) => void;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let scanner: { stop: () => Promise<void> } | null = null;
    let cancelled = false;
    const id = "qr-reader-container";

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelled) return;
      const s = new Html5Qrcode(id);
      scanner = s;
      s.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text: string) => { s.stop().catch(() => {}); onScan(text); },
        undefined
      )
        .then(() => setActive(true))
        .catch((err: unknown) =>
          onError?.(err instanceof Error ? err.message : "Camera access denied")
        );
    });

    return () => {
      cancelled = true;
      scanner?.stop().catch(() => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <div id="qr-reader-container" className="rounded-sm overflow-hidden" />
      {!active && (
        <div className="flex flex-col items-center justify-center h-48 gap-2 text-[0.82rem] text-muted">
          <span className="text-2xl">⊙</span>
          Starting camera…
        </div>
      )}
    </div>
  );
}
