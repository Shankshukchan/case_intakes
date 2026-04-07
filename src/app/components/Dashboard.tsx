// Dashboard component with metrics summary

import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Scale, Calendar, ListTodo, CheckCircle2, Plus } from "lucide-react";

export function Dashboard() {
  const { metrics, loading } = useDashboard(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of case intake and hearing readiness
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Cases",
      value: metrics.totalActiveCases,
      description: "Total cases in the system",
      icon: Scale,
      color: "text-blue-600",
    },
    {
      title: "Upcoming Hearings",
      value: metrics.upcomingHearings,
      description: "Next 7 days",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Pending Tasks",
      value: metrics.pendingTasks,
      description: "Tasks awaiting completion",
      icon: ListTodo,
      color: "text-red-600",
    },
    {
      title: "Completed Tasks",
      value: metrics.completedTasks,
      description: "Successfully finished",
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of case intake and hearing readiness
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {metrics.totalActiveCases === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              No cases in the system yet. Create your first case to begin tracking legal operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/cases")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Case
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}