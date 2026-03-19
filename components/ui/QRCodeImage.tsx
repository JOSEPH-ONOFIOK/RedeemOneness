"use client";
import { useState, useEffect } from "react";
import QRCodeLib from "qrcode";

export function QRCodeImage({ value, size = 144 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCodeLib.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#1C1208", light: "#F7F2EA" },
    }).then(setDataUrl);
  }, [value, size]);

  if (!dataUrl) return <div style={{ width: size, height: size }} className="bg-cream rounded-[4px] mx-auto" />;
  return <img src={dataUrl} alt="QR Code" width={size} height={size} className="rounded-[4px] mx-auto" />;
}
