import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

interface DashboardCardProps {
  title: string;
  description: string;
  to: string;
}

export function DashboardCard({ title, description, to }: DashboardCardProps) {
  return (
    <Link
      to={to}
      className="block no-underline hover:no-underline cursor-pointer hover:bg-muted transition-colors"
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction />
        </CardHeader>
      </Card>
    </Link>
  );
}