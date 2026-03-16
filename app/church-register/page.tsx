"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Btn, SectionLabel, FormInput, Card } from "@/components/ui";
import { churchSignup } from "@/lib/supabase/actions";

export default function ChurchRegisterPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await churchSignup(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-[520px] animate-fade-up">
        <Link href="/" className="block font-serif text-[1.2rem] font-semibold text-deep-brown mb-8 text-center">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <SectionLabel>Branch Registration</SectionLabel>
        <h1 className="font-serif text-[2.6rem] font-light mb-8">Register a <em className="text-amber">Church Branch</em></h1>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormInput label="Church Name"  name="church_name"  placeholder="Redeemed Christian Church of God" required />
            <FormInput label="Branch Name"  name="branch_name"  placeholder="Lagos Island Branch"               required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="City"  name="city"  placeholder="Lagos"       required />
              <FormInput label="State" name="state" placeholder="Lagos State" required />
            </div>
            <FormInput label="Country" name="country" placeholder="Nigeria" defaultValue="Nigeria" required />

            <div className="border-t border-[rgba(60,42,20,0.1)] pt-5 mt-1 mb-1">
              <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-4">Admin Account</p>
              <FormInput label="Admin Name"  name="admin_name" placeholder="Pastor Emmanuel Adeyemi" required />
              <FormInput label="Admin Email" name="email"      type="email"    required />
              <FormInput label="Password"    name="password"   type="password" placeholder="Create a strong password" required />
            </div>

            {error && (
              <p className="text-terra text-[0.78rem] mb-4 p-3 bg-terra/5 rounded-sm border border-terra/20">{error}</p>
            )}

            <Btn type="submit" className="w-full justify-center mt-2" disabled={isPending}>
              {isPending ? "Registering…" : "Register Branch & Get QR Code"}
            </Btn>
          </form>

          <div className="mt-5 p-4 bg-cream rounded-[4px] text-center">
            <p className="text-[0.68rem] tracking-[0.1em] uppercase text-muted mb-1">System Generates</p>
            <p className="font-serif text-[1rem] text-amber">✦ Unique Branch QR Code</p>
          </div>
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
