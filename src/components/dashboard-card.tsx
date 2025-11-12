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
      className="block custom-link h-full"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-center text-xl pt-7">{title}</CardTitle>
          <CardDescription className="font-normal">{description}</CardDescription>
          <CardAction />
        </CardHeader>
      </Card>
    </Link>
  );
}