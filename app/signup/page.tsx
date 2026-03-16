"use client";
import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Btn, SectionLabel, FormInput, FormSelect, Card, SkillTagsInput } from "@/components/ui";
import { memberSignup } from "@/lib/supabase/actions";

const QRScanner = dynamic(() => import("@/components/QRScanner"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-48 gap-2 text-[0.82rem] text-muted">
      <span className="text-2xl">⊙</span>
      Loading scanner…
    </div>
  ),
});

function extractBranchCode(scanned: string): string | null {
  try {
    const url = new URL(scanned);
    return url.searchParams.get("branch");
  } catch {
    if (scanned.trim().length >= 5) return scanned.trim();
    return null;
  }
}

function SignupContent() {
  const searchParams = useSearchParams();
  const urlBranch = searchParams.get("branch") ?? "";

  const [branch, setBranch]   = useState(urlBranch);
  const [step, setStep]       = useState<"scan" | "form">(urlBranch ? "form" : "scan");
  const [scanError, setScanError] = useState("");
  const [formError, setFormError] = useState("");
  const [skills, setSkills]   = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleScan(value: string) {
    const code = extractBranchCode(value);
    if (code) { setBranch(code); setScanError(""); setStep("form"); }
    else setScanError("Invalid QR code — please scan your church branch QR code.");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const fd = new FormData(e.currentTarget);
    fd.set("branch_code", branch);
    fd.set("skills", skills.join(","));
    startTransition(async () => {
      const result = await memberSignup(fd);
      if (result?.error) setFormError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-[520px] animate-fade-up">

        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-[1.3rem] font-semibold text-deep-brown block mb-4">
            Redeem <em className="text-amber">Oneness</em>
          </Link>
          <SectionLabel center>Member Registration</SectionLabel>

          {step === "scan" && (
            <>
              <h1 className="font-serif text-[2.6rem] font-light mt-2">
                Scan your <em className="text-amber">branch QR</em>
              </h1>
              <p className="text-muted text-[0.85rem] mt-2 max-w-[320px] mx-auto">
                Point your camera at your church branch&apos;s QR code to begin registration
              </p>
            </>
          )}

          {step === "form" && (
            <>
              <h1 className="font-serif text-[2.6rem] font-light mt-2">
                Create your <em className="text-amber">account</em>
              </h1>
              <div className="inline-flex items-center gap-2 mt-3 text-[0.72rem] tracking-[0.1em] uppercase bg-cream px-4 py-1.5 rounded-sm text-amber border border-amber/30">
                <span className="text-forest font-semibold">✓</span> {branch}
              </div>
            </>
          )}
        </div>

        {step === "scan" && (
          <Card>
            <QRScanner onScan={handleScan} onError={(e) => setScanError(e)} />
            {scanError && <p className="text-terra text-[0.78rem] text-center mt-3">{scanError}</p>}
          </Card>
        )}

        {step === "form" && (
          <Card>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="branch_code" value={branch} />
              <FormInput label="Full Name" name="full_name"  placeholder="Chidera Okafor"           required />
              <FormInput label="Email"     name="email"      type="email" placeholder="chidera@email.com" required />
              <FormInput label="Phone"     name="phone"      type="tel"   placeholder="+234 801 234 5678" />
              <FormInput label="Password"  name="password"   type="password" placeholder="Create a strong password" required />
              <FormInput label="Location"  name="location"   placeholder="Lagos, Nigeria" />
              <FormSelect
                label="Sector Interests" name="sector_interests"
                options={["Select sectors…","Technology","Finance","Healthcare","Education","Creative Arts","Engineering","Law","Business"]}
              />
              <FormSelect
                label="Job Categories" name="job_categories"
                options={["Select categories…","Internship","Full-time","Part-time","Volunteer","Freelance"]}
              />
              <SkillTagsInput label="Skills" initial={[]} onChange={setSkills} />
              {formError && (
                <p className="text-terra text-[0.78rem] mb-4 p-3 bg-terra/5 rounded-sm border border-terra/20">{formError}</p>
              )}
              <Btn type="submit" className="w-full justify-center mt-2" disabled={isPending}>
                {isPending ? "Creating account…" : "Create Account"}
              </Btn>
            </form>
            <p className="text-[0.75rem] text-muted text-center mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-amber hover:underline">Login</Link>
            </p>
          </Card>
        )}

        <p className="text-[0.72rem] text-muted/50 text-center mt-5">
          <Link href="/" className="hover:text-muted transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}
