"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Btn, SectionLabel, FormInput, FormSelect, FormTextarea, Card } from "@/components/ui";
import { mentorSignup } from "@/lib/supabase/actions";

export default function MentorRegisterPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await mentorSignup(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-[480px] animate-fade-up">
        <Link href="/" className="block font-serif text-[1.2rem] font-semibold text-deep-brown mb-8 text-center">
          Redeem <em className="text-forest">Oneness</em>
        </Link>
        <SectionLabel>Mentor Registration</SectionLabel>
        <h1 className="font-serif text-[2.6rem] font-light mb-8">Become a <em className="text-forest">Mentor</em></h1>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormInput label="Full Name"          name="full_name"        placeholder="Dr. Adaeze Obi"    required />
            <FormInput label="Email"              name="email"            type="email"                    required />
            <FormInput label="Password"           name="password"         type="password" placeholder="Create a strong password" required />
            <FormInput label="Phone"              name="phone"            type="tel" placeholder="+234 …" />
            <FormSelect label="Sector Expertise"  name="sector_expertise"
              options={["Select sector…","Technology","Finance","Law","Medicine","Engineering","Education"]} required />
            <FormInput label="Years of Experience" name="years_experience" type="number" placeholder="8" required />
            <FormTextarea label="Short Bio"       name="bio"
              placeholder="Tell members about your experience and how you can help…" rows={4} />
            <FormInput label="Location"           name="location"        placeholder="Lagos, Nigeria" />
            <FormSelect label="Preferred Contact" name="preferred_contact"
              options={["Platform Messages","Email","WhatsApp","Phone Call"]} />
            {error && (
              <p className="text-terra text-[0.78rem] mb-4 p-3 bg-terra/5 rounded-sm border border-terra/20">{error}</p>
            )}
            <Btn type="submit" className="w-full justify-center mt-2" disabled={isPending}>
              {isPending ? "Registering…" : "Register as Mentor"}
            </Btn>
          </form>
        </Card>
        <p className="text-center mt-4">
          <Link href="/login" className="text-[0.75rem] text-muted/60 hover:text-muted transition-colors">
            Already registered? Sign in →
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-[0.75rem] text-muted/60 hover:text-muted transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
