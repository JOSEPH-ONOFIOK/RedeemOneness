import DashLayout from "@/components/layout/DashLayout";
import { ReactNode } from "react";
export default function MentorLayout({ children }: { children: ReactNode }) {
  return <DashLayout role="mentor">{children}</DashLayout>;
}
