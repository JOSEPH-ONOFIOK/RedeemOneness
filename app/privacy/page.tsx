import Link from "next/link";
import { Btn, SectionLabel } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-5 bg-warm-white/95 backdrop-blur-md border-b border-[rgba(60,42,20,0.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-semibold text-deep-brown">
          Redeem <em className="text-amber">Oneness</em>
        </Link>
        <Btn href="/login" small>Login</Btn>
      </nav>

      <div className="max-w-[760px] mx-auto px-6 pt-36 pb-24">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.05] mb-8">Privacy Policy</h1>

        {[
          ["Information We Collect", "We collect information you provide directly — including your name, email address, phone number, location, skills, and employment status — when you register or update your profile on Redeem Oneness."],
          ["How We Use Your Information", "Your information is used to match you with relevant jobs, mentors, and church branch opportunities. We do not sell your personal data to third parties."],
          ["Data Sharing", "Your profile information is visible to branch admins within your registered church branch, and to businesses and mentors on the platform when you apply for jobs or request mentorship. Your phone number is only shown to admins and businesses you have engaged with."],
          ["Data Security", "We use Supabase infrastructure with row-level security to protect your data. All data is encrypted in transit and at rest."],
          ["Your Rights", "You may request to update or delete your account data at any time by contacting us at hello@redeemoneness.com."],
          ["Cookies", "We use essential cookies for authentication and session management only. No advertising cookies are used."],
          ["Changes to This Policy", "We may update this policy from time to time. Continued use of the platform after changes constitutes acceptance of the updated policy."],
          ["Contact", "For any privacy-related queries, contact us at hello@redeemoneness.com."],
        ].map(([title, body]) => (
          <div key={title} className="mb-8">
            <h2 className="font-serif text-[1.1rem] font-semibold mb-2">{title}</h2>
            <p className="text-[0.9rem] leading-[1.8] text-muted">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
