"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import clsx from "clsx";
import { Btn, SectionLabel, FormInput, Card } from "@/components/ui";
import { login } from "@/lib/supabase/actions";

type Role = "member" | "business" | "mentor" | "admin";

const ROLES: {
  id: Role;
  label: string;
  registerHref: string;
  registerLabel: string;
  note?: string;
}[] = [
  { id: "member",   label: "Member",      registerHref: "/signup",           registerLabel: "Join as Member",       note: "Scan your church branch QR code to create an account" },
  { id: "business", label: "Business",    registerHref: "/business-register", registerLabel: "Register a Business" },
  { id: "mentor",   label: "Mentor",      registerHref: "/mentor-register",   registerLabel: "Become a Mentor" },
  { id: "admin",    label: "Branch Admin",registerHref: "/church-register",   registerLabel: "Register a Branch" },
];

export default function LoginPage() {
  const [role, setRole]   = useState<Role>("member");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const current = ROLES.find((r) => r.id === role)!;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="bg-deep-brown relative hidden md:flex flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(196,131,42,0.12),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(62,126,166,0.08),transparent_70%)]" />
        <div className="text-center relative z-10">
          <Link href="/" className="block font-serif text-[2.8rem] font-light text-cream mb-4">
            Redeem <em className="text-gold">Oneness</em>
          </Link>
          <p className="text-white/50 text-[0.9rem] leading-[1.75] max-w-[300px]">
            Your faith community is waiting. Sign in to access jobs, mentors, and your network.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-center">
            {[["2,400+","Members","text-gold"],["95+","Branches","text-sky"],["180+","Businesses","text-sky"],["38","Mentors","text-forest"]].map(([n,l,c]) => (
              <div key={l} className="border border-white/10 rounded-[4px] p-4">
                <div className={`font-serif text-[1.8rem] font-light ${c}`}>{n}</div>
                <div className="text-[0.68rem] tracking-[0.1em] uppercase text-white/35 mt-1">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-left space-y-2">
            <p className="text-[0.65rem] tracking-[0.14em] uppercase text-white/30 mb-3">New here?</p>
            {ROLES.map((r) => (
              <Link key={r.id} href={r.registerHref}
                className="flex items-center justify-between text-[0.78rem] text-white/45 hover:text-cream transition-colors py-1 border-b border-white/[0.06]">
                <span>{r.registerLabel}</span>
                <span className="text-amber/60">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-8 bg-warm-white">
        <div className="w-full max-w-[420px] animate-fade-up">
          <SectionLabel>Welcome Back</SectionLabel>
          <h1 className="font-serif text-[2.6rem] font-light mb-6">Sign in</h1>

          {/* Role tabs */}
          <div className="flex border border-[rgba(60,42,20,0.12)] rounded-sm mb-6 overflow-hidden">
            {ROLES.map((r) => (
              <button key={r.id} type="button" onClick={() => { setRole(r.id); setError(""); }}
                className={clsx(
                  "flex-1 text-[0.65rem] tracking-[0.08em] uppercase py-2.5 font-medium transition-colors",
                  role === r.id ? "bg-deep-brown text-cream" : "text-muted hover:text-deep-brown"
                )}>
                {r.label}
              </button>
            ))}
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <FormInput label="Email"    name="email"    type="email"    placeholder="you@example.com" required />
              <FormInput label="Password" name="password" type="password" placeholder="••••••••"        required />
              {error && (
                <p className="text-terra text-[0.78rem] mb-4 p-3 bg-terra/5 rounded-sm border border-terra/20">{error}</p>
              )}
              <div className="text-right mb-5">
                <span className="text-[0.78rem] text-amber cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <Btn type="submit" className="w-full justify-center" disabled={isPending}>
                {isPending ? "Signing in…" : `Sign in as ${current.label}`}
              </Btn>
            </form>
            <p className="text-[0.75rem] text-muted text-center mt-4">
              No account?{" "}
              <Link href={current.registerHref} className="text-amber hover:underline">
                {current.registerLabel}
              </Link>
            </p>
          </Card>

          {current.id === "member" && (
            <p className="text-[0.72rem] text-muted/60 text-center mt-3 flex items-center justify-center gap-1.5">
              <span className="text-amber">⊙</span> New members: scan your branch QR code to register
            </p>
          )}

          <p className="text-[0.72rem] text-muted/50 text-center mt-4">
            <Link href="/" className="hover:text-muted transition-colors">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
