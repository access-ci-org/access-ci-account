import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

export function DashboardCard({ title, description, to, icon: Icon }: DashboardCardProps) {
  return (
    <Link
      to={to}
      className="group block custom-link h-full rounded-none border border-[var(--teal-700)] bg-[var(--teal-700)] hover:border-[var(--teal-700)] hover:bg-white hover:text-[var(--teal-700)]"
    >
      <Card className="h-full bg-[var(--teal-700)] text-white border-none shadow-none rounded-none group-hover:bg-white group-hover:text-[var(--teal-700)]">
        <CardHeader>
          <Icon className="h-10 w-10 text-white group-hover:text-[var(--teal-700)] transition-colors" />
          <CardTitle className="text-center text-xl pt-7 group-hover:text-[var(--teal-700)]">{title}</CardTitle>
          <CardDescription className="font-normal text-white group-hover:text-[var(--teal-700)]">{description}</CardDescription>
          <CardAction />
        </CardHeader>
      </Card>
    </Link>
  );
}