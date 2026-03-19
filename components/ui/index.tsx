"use client";
import { ReactNode, useState, useEffect, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import clsx from "clsx";
// ── Avatar ────────────────────────────────────────────────────────
export function Avatar({
  name,
  size = 40,
  colorClass = "bg-amber",
}: {
  name: string;
  size?: number;
  colorClass?: string;
}) {
  const sizeStyle = { width: size, height: size, fontSize: size * 0.38, flexShrink: 0 };
  return (
    <div
      className={clsx("rounded-full flex items-center justify-center font-serif font-semibold text-cream", colorClass)}
      style={sizeStyle}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────
type BtnVariant = "primary" | "amber" | "outline" | "ghost" | "danger" | "sage";

export function Btn({
  children,
  variant = "primary",
  onClick,
  href,
  className = "",
  small = false,
  type = "button",
  form,
  disabled = false,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  href?: string;
  className?: string;
  small?: boolean;
  type?: "button" | "submit";
  form?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center gap-1.5 font-sans font-medium tracking-widest uppercase rounded-sm transition-all duration-200 cursor-pointer border border-transparent";
  const size = small ? "text-[0.72rem] px-4 py-1.5" : "text-[0.78rem] px-6 py-2.5";

  const variants: Record<BtnVariant, string> = {
    primary: "bg-deep-brown text-cream hover:bg-amber",
    amber:   "bg-amber text-cream hover:opacity-90",
    outline: "bg-transparent text-deep-brown border-deep-brown hover:bg-deep-brown hover:text-cream",
    ghost:   "bg-transparent text-muted border-[rgba(60,42,20,0.2)] hover:text-deep-brown",
    danger:  "bg-transparent text-terra border-terra hover:bg-terra hover:text-cream",
    sage:    "bg-sage text-cream hover:opacity-90",
  };

  const cls = clsx(base, size, variants[variant], disabled && "opacity-50 cursor-not-allowed", className);

  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type={type} form={form} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

// ── Tag ───────────────────────────────────────────────────────────
export function Tag({ children, amber = false }: { children: ReactNode; amber?: boolean }) {
  return (
    <span
      className={clsx(
        "text-[0.65rem] px-2 py-0.5 rounded-sm tracking-[0.05em] border",
        amber ? "border-amber text-amber" : "border-[rgba(60,42,20,0.15)] text-muted"
      )}
    >
      {children}
    </span>
  );
}

// ── Badge ─────────────────────────────────────────────────────────
type BadgeType = "default" | "new" | "accepted" | "rejected" | "pending" | "interview" | "viewed" | "sky" | "forest";

export function Badge({ children, type = "default" }: { children: ReactNode; type?: BadgeType }) {
  const styles: Record<BadgeType, string> = {
    default:   "bg-[rgba(60,42,20,0.06)] text-muted",
    new:       "bg-[rgba(196,131,42,0.12)] text-amber",
    accepted:  "bg-[rgba(46,107,82,0.12)] text-forest",
    rejected:  "bg-[rgba(184,92,56,0.12)] text-terra",
    pending:   "bg-[rgba(196,131,42,0.08)] text-amber",
    interview: "bg-[rgba(62,126,166,0.12)] text-sky",
    viewed:    "bg-[rgba(60,42,20,0.06)] text-muted",
    sky:       "bg-[rgba(62,126,166,0.12)] text-sky",
    forest:    "bg-[rgba(46,107,82,0.12)] text-forest",
  };
  return (
    <span className={clsx("text-[0.62rem] px-2 py-0.5 rounded-sm font-medium tracking-[0.08em] uppercase", styles[type])}>
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={clsx(
        "border border-[rgba(60,42,20,0.12)] rounded-[4px] bg-warm-white p-4 md:p-6 transition-all duration-200",
        hover && "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(28,18,8,0.07)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// ── SectionLabel ─────────────────────────────────────────────────
export function SectionLabel({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.18em] uppercase text-amber mb-2",
        center && "justify-center"
      )}
    >
      <span className="block w-6 h-px bg-amber" />
      {children}
      {center && <span className="block w-6 h-px bg-amber" />}
    </div>
  );
}

// ── PasswordInput (show/hide + optional confirm) ──────────────────
export function PasswordInput({
  label,
  name,
  placeholder,
  required,
  confirmOf,
  onChange,
}: {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  confirmOf?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [show, setShow] = useState(false);
  const [val, setVal]   = useState("");
  const match = confirmOf !== undefined && val.length > 0 ? val === confirmOf : null;

  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">
          {label}{required && <span className="text-amber"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={val}
          onChange={(e) => { setVal(e.target.value); onChange?.(e); }}
          placeholder={placeholder}
          required={required}
          className={clsx(
            "w-full px-3.5 py-2.5 pr-10 border rounded-sm bg-warm-white text-deep-brown text-[0.88rem] outline-none transition-colors duration-200",
            match === true  && "border-forest focus:border-forest",
            match === false && "border-terra focus:border-terra",
            match === null  && "border-[rgba(60,42,20,0.12)] focus:border-amber"
          )}
        />
        <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-deep-brown transition-colors">
          {show ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {match === false && (
        <p className="text-terra text-[0.68rem] mt-1">Passwords do not match</p>
      )}
      {match === true && (
        <p className="text-forest text-[0.68rem] mt-1">Passwords match ✓</p>
      )}
    </div>
  );
}

// ── FormInput ─────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}
export function FormInput({ label, required, className, ...props }: InputProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">
          {label}
          {required && <span className="text-amber"> *</span>}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          "w-full px-3.5 py-2.5 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-deep-brown text-[0.88rem] outline-none transition-colors duration-200 focus:border-amber",
          className
        )}
      />
    </div>
  );
}

// ── FormTextarea ──────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export function FormTextarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={clsx(
          "w-full px-3.5 py-2.5 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-deep-brown text-[0.88rem] outline-none resize-y transition-colors duration-200 focus:border-amber font-sans",
          className
        )}
      />
    </div>
  );
}

// ── FormSelect ────────────────────────────────────────────────────
import type { SelectHTMLAttributes } from "react";
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}
export function FormSelect({ label, options, required, className, ...props }: SelectProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">
          {label}
          {required && <span className="text-amber"> *</span>}
        </label>
      )}
      <select
        required={required}
        {...props}
        className={clsx("w-full px-3.5 py-2.5 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white text-deep-brown text-[0.88rem] outline-none focus:border-amber transition-colors duration-200", className)}
      >
        {options.map((o, i) => (
          <option key={o} value={i === 0 && required ? "" : o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────
export function StatCard({
  number,
  label,
  icon,
  colorClass = "text-amber",
}: {
  number: string;
  label: string;
  icon: string;
  colorClass?: string;
}) {
  return (
    <Card className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={clsx("font-serif text-[clamp(1.6rem,4vw,2.4rem)] font-light leading-none", colorClass)}>{number}</div>
      <div className="text-[0.72rem] tracking-[0.1em] uppercase text-muted mt-1.5">{label}</div>
    </Card>
  );
}

// ── PageTitle ─────────────────────────────────────────────────────
export function PageTitle({
  label,
  title,
  action,
}: {
  label?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
      <div>
        {label && <SectionLabel>{label}</SectionLabel>}
        <h1 className="font-serif text-[clamp(1.4rem,4vw,2.2rem)] font-light leading-tight mt-1">{title}</h1>
      </div>
      {action && <div className="flex gap-2 shrink-0">{action}</div>}
    </div>
  );
}

// ── SkillTags editable ────────────────────────────────────────────
export function SkillTagsInput({ label, initial, onChange }: { label: string; initial: string[]; onChange?: (tags: string[]) => void }) {
  const [tags, setTags] = useState(initial);
  const [input, setInput] = useState("");
  const remove = (t: string) => { const next = tags.filter((x) => x !== t); setTags(next); onChange?.(next); };
  const add = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      const next = [...tags, input.trim()];
      setTags(next);
      setInput("");
      onChange?.(next);
    }
  };
  return (
    <div className="mb-5">
      <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-muted mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2.5 border border-[rgba(60,42,20,0.12)] rounded-sm bg-warm-white min-h-[44px]">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => remove(t)}
            className="text-[0.65rem] px-2 py-0.5 rounded-sm border border-amber text-amber hover:bg-amber hover:text-cream transition-colors"
          >
            {t} ×
          </button>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add skill…"
          className="text-[0.82rem] text-muted bg-transparent outline-none min-w-[80px] flex-1"
        />
      </div>
      <p className="text-[0.65rem] text-muted mt-0.5">Press Enter to add</p>
    </div>
  );
}

export { QRCodeImage } from "./QRCodeImage";
