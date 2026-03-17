"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, PasswordInput, Btn, SectionLabel } from "@/components/ui";
import { resetPassword } from "@/lib/supabase/actions";

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const confirm = fd.get("confirm_password") as string;
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    startTransition(async () => {
      const result = await resetPassword(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] animate-fade-up">
        <Link href="/" className="block font-serif text-[1.3rem] font-semibold text-deep-brown mb-8 text-center">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <SectionLabel>Security</SectionLabel>
        <h1 className="font-serif text-[2.4rem] font-light mb-8">Set new <em className="text-amber">password</em></h1>
        <Card>
          <form onSubmit={handleSubmit}>
            <PasswordInput label="New Password"     name="password"         placeholder="Create a strong password" required
              onChange={(e) => setPassword(e.target.value)} />
            <PasswordInput label="Confirm Password" name="confirm_password" placeholder="Repeat your password"     required
              confirmOf={password} />
            {error && (
              <p className="text-terra text-[0.78rem] mb-4 p-3 bg-terra/5 rounded-sm border border-terra/20">{error}</p>
            )}
            <Btn type="submit" className="w-full justify-center" disabled={isPending}>
              {isPending ? "Saving…" : "Set Password"}
            </Btn>
          </form>
        </Card>
      </div>
    </div>
  );
}
