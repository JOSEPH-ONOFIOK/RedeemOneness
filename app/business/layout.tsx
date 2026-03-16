import DashLayout from "@/components/layout/DashLayout";
import { ReactNode } from "react";
export default function BusinessLayout({ children }: { children: ReactNode }) {
  return <DashLayout role="business">{children}</DashLayout>;
}
