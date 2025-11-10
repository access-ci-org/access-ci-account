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
      className="block custom-link"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
          <CardAction />
        </CardHeader>
      </Card>
    </Link>
  );
}