"use client";
import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Btn, SectionLabel, FormInput, FormSelect, Card, SkillTagsInput, PasswordInput } from "@/components/ui";
import { memberSignup } from "@/lib/supabase/actions";

function SignupContent() {
  const searchParams = useSearchParams();
  const branchCode = searchParams.get("branch") ?? "";

  const [password, setPassword]   = useState("");
  const [formError, setFormError] = useState("");
  const [skills, setSkills]       = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("confirm_password")) {
      setFormError("Passwords do not match."); return;
    }
    setFormError("");
    fd.set("branch_code", branchCode);
    fd.set("skills", skills.join(","));
    startTransition(async () => {
      const result = await memberSignup(fd);
      if (result?.error) setFormError(result.error);
    });
  }

  if (!branchCode) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center px-6">
        <div className="w-full max-w-[420px] text-center animate-fade-up">
          <Link href="/" className="font-serif text-[1.3rem] font-semibold text-deep-brown block mb-8">
            Redeem <em className="text-amber">Oneness</em>
          </Link>
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-[2rem] mx-auto mb-6">⛪</div>
          <h1 className="font-serif text-[2rem] font-light mb-3">Scan your branch QR</h1>
          <p className="text-muted text-[0.88rem] leading-[1.7] mb-6">
            Ask your church branch admin for the branch QR code. Scan it with your phone camera to open the registration page.
          </p>
          <div className="bg-cream border border-[rgba(60,42,20,0.12)] rounded-sm p-4 text-[0.78rem] text-muted">
            The QR code links directly to your branch registration page.
          </div>
          <p className="text-[0.72rem] text-muted/50 text-center mt-6">
            <Link href="/login" className="text-amber hover:underline">Already have an account? Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-6 py-12 md:py-24">
      <div className="w-full max-w-[520px] animate-fade-up">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-[1.3rem] font-semibold text-deep-brown block mb-4">
            Redeem <em className="text-amber">Oneness</em>
          </Link>
          <SectionLabel center>Member Registration</SectionLabel>
          <h1 className="font-serif text-[2.6rem] font-light mt-2">
            Create your <em className="text-amber">account</em>
          </h1>
          <div className="inline-flex items-center gap-2 mt-3 text-[0.72rem] tracking-[0.1em] uppercase bg-cream px-4 py-1.5 rounded-sm text-amber border border-amber/30">
            <span className="text-forest font-semibold">✓</span> {branchCode}
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="branch_code" value={branchCode} />
            <FormInput label="Full Name" name="full_name"  placeholder="Chidera Okafor"           required />
            <FormInput label="Email"     name="email"      type="email" placeholder="chidera@email.com" required />
            <FormInput label="Phone"     name="phone"      type="tel"   placeholder="+234 801 234 5678" />
            <PasswordInput label="Password"         name="password"         placeholder="Create a strong password" required onChange={(e) => setPassword(e.target.value)} />
            <PasswordInput label="Confirm Password" name="confirm_password" placeholder="Repeat your password"     required confirmOf={password} />
            <FormInput label="Location"  name="location"   placeholder="Lagos, Nigeria" />
            <FormInput label="Date of Birth" name="date_of_birth" type="date" />
            <div className="mb-5">
              <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-2">
                Currently Employed? <span className="text-muted/50">(optional)</span>
              </label>
              <div className="flex gap-3">
                {[["yes","Yes — Employed"],["no","No — Unemployed"]].map(([v,l]) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer flex-1 border border-[rgba(60,42,20,0.12)] rounded-sm px-4 py-2.5 has-[:checked]:border-amber has-[:checked]:bg-amber/5 transition-colors">
                    <input type="radio" name="employment_status" value={v} className="accent-amber" />
                    <span className="text-[0.82rem]">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <FormSelect label="Sector Interests" name="sector_interests"
              options={["Select sectors…","Technology","Finance","Healthcare","Education","Creative Arts","Engineering","Law","Business"]} />
            <FormSelect label="Job Categories" name="job_categories"
              options={["Select categories…","Internship","Full-time","Part-time","Volunteer","Freelance"]} />
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

        <p className="text-[0.72rem] text-muted/50 text-center mt-5">
          <Link href="/" className="hover:text-muted transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <Suspense><SignupContent /></Suspense>;
}
