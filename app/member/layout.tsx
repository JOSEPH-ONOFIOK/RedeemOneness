import DashLayout from "@/components/layout/DashLayout";
import { ReactNode } from "react";

export default function MemberLayout({ children }: { children: ReactNode }) {
  return <DashLayout role="member">{children}</DashLayout>;
}
