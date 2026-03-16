import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redeem Oneness — Where Faith Meets Opportunity",
  description: "Connecting church members with jobs, mentors, and businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
