import Link from "next/link";
import { Btn, SectionLabel } from "@/components/ui";

export default function TermsPage() {
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
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.05] mb-8">Terms of Service</h1>

        {[
          ["Acceptance of Terms", "By accessing or using Redeem Oneness, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform."],
          ["Eligibility", "You must be at least 16 years old to use Redeem Oneness. By registering, you confirm that the information you provide is accurate and that you are a member or associate of a registered church branch."],
          ["Member Accounts", "Members register via their church branch QR code. You are responsible for maintaining the confidentiality of your account credentials. You may not share your account with others."],
          ["Business & Mentor Accounts", "Businesses and mentors register independently and agree to post only genuine opportunities. Fraudulent job postings or misleading mentorship offers will result in account termination."],
          ["Prohibited Conduct", "You may not use Redeem Oneness to harass other users, post illegal content, misrepresent your identity, or engage in any activity that violates Nigerian law or the platform's community standards."],
          ["Intellectual Property", "All content, design, and code on this platform is the property of Redeem Oneness. You may not copy, reproduce, or distribute any part without written permission."],
          ["Termination", "We reserve the right to suspend or terminate any account that violates these terms, without notice."],
          ["Limitation of Liability", "Redeem Oneness is not liable for the accuracy of job postings, the conduct of users, or any losses arising from use of the platform."],
          ["Governing Law", "These terms are governed by the laws of the Federal Republic of Nigeria."],
          ["Contact", "For questions about these terms, contact us at hello@redeemoneness.com."],
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
