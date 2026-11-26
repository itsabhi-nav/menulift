import { AdminShell } from "@/components/AdminShell";
import { AdminSkeleton } from "@/components/AdminSkeleton";

export default function Loading() {
  return (
    <AdminShell title="Loading">
      <AdminSkeleton />
    </AdminShell>
  );
}
