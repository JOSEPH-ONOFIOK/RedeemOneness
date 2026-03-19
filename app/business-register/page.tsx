"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Btn, SectionLabel, FormInput, FormSelect, FormTextarea, Card, PasswordInput } from "@/components/ui";
import { businessSignup } from "@/lib/supabase/actions";

export default function BusinessRegisterPage() {
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("confirm_password")) {
      setError("Passwords do not match."); return;
    }
    setError("");
    startTransition(async () => {
      const result = await businessSignup(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-6 py-12 md:py-24">
      <div className="w-full max-w-[480px] animate-fade-up">
        <Link href="/" className="block font-serif text-[1.2rem] font-semibold text-deep-brown mb-8 text-center">
          Redeem <em className="text-sky">Oneness</em>
        </Link>
        <SectionLabel>Business Registration</SectionLabel>
        <h1 className="font-serif text-[2.6rem] font-light mb-8">Register your <em className="text-sky">Business</em></h1>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormInput label="Company Name"     name="company_name" placeholder="XYZ Tech Ltd"    required />
            <FormInput label="Contact Email"    name="email"        type="email"                   required />
            <PasswordInput label="Password"         name="password"         placeholder="Create a strong password" required onChange={(e) => setPassword(e.target.value)} />
            <PasswordInput label="Confirm Password" name="confirm_password" placeholder="Repeat your password"     required confirmOf={password} />
            <FormSelect label="Industry Sector" name="industry"
              options={["Select sector…","Technology","Finance","Healthcare","Education","Manufacturing","Creative"]} required />
            <FormTextarea label="Company Description" name="description"
              placeholder="Tell members what your company does…" rows={3} />
            <FormInput label="Company Location" name="location"  placeholder="Lagos, Nigeria" />
            <FormInput label="Website"          name="website"   placeholder="https://yourcompany.com" />
            {error && (
              <p className="text-terra text-[0.78rem] mb-4 p-3 bg-terra/5 rounded-sm border border-terra/20">{error}</p>
            )}
            <Btn type="submit" className="w-full justify-center mt-2" disabled={isPending}>
              {isPending ? "Registering…" : "Register Business"}
            </Btn>
          </form>
        </Card>
        <p className="text-center mt-4">
          <Link href="/login" className="text-[0.75rem] text-muted/60 hover:text-muted transition-colors">
            Already registered? Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
