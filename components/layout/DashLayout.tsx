"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

type Role = "member" | "business" | "mentor" | "admin";

const NAV: Record<Role, { icon: string; label: string; href: string }[]> = {
  member: [
    { icon: "⌂",  label: "Home Feed",     href: "/member" },
    { icon: "⚡",  label: "Jobs",          href: "/member/jobs" },
    { icon: "✉",  label: "Messages",      href: "/member/messages" },
    { icon: "◈",  label: "Mentorship",    href: "/member/mentorship" },
    { icon: "◉",  label: "Applications",  href: "/member/applications" },
    { icon: "🔔", label: "Notifications", href: "/member/notifications" },
    { icon: "◎",  label: "Profile",       href: "/member/profile" },
  ],
  business: [
    { icon: "⌂",  label: "Dashboard",      href: "/business" },
    { icon: "＋", label: "Post Job",        href: "/business/post-job" },
    { icon: "⚡",  label: "Search Members", href: "/business/search-members" },
    { icon: "✉",  label: "Messages",       href: "/business/messages" },
    { icon: "◈",  label: "Applications",   href: "/business/applications" },
    { icon: "◎",  label: "Company Profile",href: "/business/profile" },
  ],
  mentor: [
    { icon: "⌂",  label: "Dashboard",     href: "/mentor" },
    { icon: "◈",  label: "Requests",      href: "/mentor/requests" },
    { icon: "✉",  label: "Messages",      href: "/mentor/messages" },
    { icon: "📢", label: "Announcements", href: "/mentor/announcements" },
    { icon: "◎",  label: "Profile",       href: "/mentor/profile" },
  ],
  admin: [
    { icon: "⌂",  label: "Dashboard",    href: "/admin" },
    { icon: "◉",  label: "Members",      href: "/admin/members" },
    { icon: "📢", label: "Announcements",href: "/admin/announcements" },
    { icon: "⚡",  label: "Search",       href: "/admin/search" },
    { icon: "🎂", label: "Birthdays",    href: "/admin/birthdays" },
    { icon: "👥", label: "Admins",       href: "/admin/admins" },
    { icon: "⚙",  label: "Settings",     href: "/admin/settings" },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  member: "Member Portal",
  business: "Business Portal",
  mentor: "Mentor Portal",
  admin: "Branch Admin",
};

const ROLE_COLORS: Record<Role, string> = {
  member: "text-amber",
  business: "text-sage",
  mentor: "text-terra",
  admin: "text-gold",
};

export default function DashLayout({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[role];

  return (
    <div className="flex min-h-screen bg-warm-white">
      {/* Sidebar */}
      <aside className="w-[220px] bg-deep-brown flex flex-col fixed top-0 left-0 h-screen z-50">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/" className="block font-serif text-[1.15rem] font-semibold text-cream mb-0.5">
            Redeem <em className="text-gold">Oneness</em>
          </Link>
          <p className={clsx("text-[0.65rem] tracking-[0.12em] uppercase mt-1", ROLE_COLORS[role])}>
            {ROLE_LABELS[role]}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2.5 px-5 py-2.5 text-[0.82rem] transition-all duration-150",
                  "border-l-2",
                  active
                    ? "bg-amber/10 border-amber text-cream"
                    : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"
                )}
              >
                <span className="w-5 text-[0.9rem]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <Link
            href="/login"
            className="text-[0.75rem] text-white/30 hover:text-white/60 transition-colors"
          >
            ← Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[220px] flex-1 p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}
