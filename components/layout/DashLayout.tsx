"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
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
  member:   "Member Portal",
  business: "Business Portal",
  mentor:   "Mentor Portal",
  admin:    "Branch Admin",
};

const ROLE_COLORS: Record<Role, string> = {
  member:   "text-amber",
  business: "text-sage",
  mentor:   "text-terra",
  admin:    "text-gold",
};

export default function DashLayout({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = NAV[role];

  const homeHref = `/${role}`;
  const isHome = pathname === homeHref;

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <Link href="/" className="block font-serif text-[1.15rem] font-semibold text-cream mb-0.5">
            Redeem <em className="text-gold">Oneness</em>
          </Link>
          <p className={clsx("text-[0.65rem] tracking-[0.12em] uppercase mt-1", ROLE_COLORS[role])}>
            {ROLE_LABELS[role]}
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-white/40 hover:text-white/80 transition-colors text-[1.4rem] leading-none"
          aria-label="Close menu"
        >
          ✕
        </button>
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
                "flex items-center gap-2.5 px-5 py-3 md:py-2.5 text-[0.88rem] md:text-[0.82rem] transition-all duration-150 border-l-2",
                active
                  ? "bg-amber/10 border-amber text-cream"
                  : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"
              )}
            >
              <span className="w-5 text-[0.95rem]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <Link href="/login" className="text-[0.75rem] text-white/30 hover:text-white/60 transition-colors">
          ← Sign out
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-warm-white">

      {/* ── DESKTOP SIDEBAR ──────────────────────────────────── */}
      <aside className="hidden md:flex w-[220px] bg-deep-brown flex-col fixed top-0 left-0 h-screen z-50">
        <SidebarContent />
      </aside>

      {/* ── MOBILE DRAWER BACKDROP ───────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ────────────────────────────────────── */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen w-[280px] bg-deep-brown flex flex-col z-50 transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 md:ml-[220px] min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-deep-brown sticky top-0 z-30 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button
                onClick={() => router.back()}
                className="text-white/60 hover:text-white transition-colors text-[1.1rem] leading-none pr-1"
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <Link href="/" className="font-serif text-[1rem] font-semibold text-cream">
              Redeem <em className="text-gold">Oneness</em>
            </Link>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col gap-[5px] p-1.5"
            aria-label="Open menu"
          >
            <span className="w-5 h-[2px] bg-white/60 block" />
            <span className="w-5 h-[2px] bg-white/60 block" />
            <span className="w-5 h-[2px] bg-white/60 block" />
          </button>
        </div>

        <div className="p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
