"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QRCodeImage } from "@/components/ui";

export default function BranchQRCard() {
  const [branchCode, setBranchCode] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string>("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("branches")
        .select("code, branch_name, church_name")
        .eq("admin_id", user.id)
        .single();

      if (data) {
        setBranchCode(data.code);
        setBranchName(`${data.church_name} — ${data.branch_name}`);
      }
    }
    load();
  }, []);

  const signupUrl = branchCode
    ? `${window.location.origin}/signup?branch=${branchCode}`
    : null;

  return (
    <div className="bg-deep-brown rounded-[4px] p-5 text-center">
      <p className="text-[0.65rem] tracking-[0.12em] uppercase text-white/40 mb-3">Branch QR Code</p>
      {signupUrl ? (
        <>
          <div className="bg-white rounded-sm p-3 inline-block mb-3">
            <QRCodeImage value={signupUrl} size={160} />
          </div>
          <p className="font-serif text-[0.85rem] text-cream mb-1">{branchName}</p>
          <p className="text-[0.65rem] text-white/35 mb-3 break-all">{branchCode}</p>
          <p className="text-[0.72rem] text-white/50 leading-[1.6]">
            Share this QR code with members. They scan it to register directly to your branch.
          </p>
        </>
      ) : (
        <div className="h-40 flex items-center justify-center">
          <p className="text-[0.8rem] text-white/30">Loading QR code…</p>
        </div>
      )}
    </div>
  );
}
