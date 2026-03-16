import DashLayout from "@/components/layout/DashLayout";
import { ReactNode } from "react";
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashLayout role="admin">{children}</DashLayout>;
}
