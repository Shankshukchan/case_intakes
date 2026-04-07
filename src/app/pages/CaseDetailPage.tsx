// Case detail page with tasks

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { CaseService } from "../services/case.service";
import { Case, HearingTask } from "../types";
import { useTasks } from "../hooks/useTasks";
import { useUser } from "../hooks/useUser";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowLeft, Plus, Calendar, Building2, Scale } from "lucide-react";
import { format } from "date-fns";

const STAGE_COLORS: Record<string, string> = {
  Filing: "bg-blue-100 text-blue-800",
  Evidence: "bg-yellow-100 text-yellow-800",
  Arguments: "bg-orange-100 text-orange-800",
  "Order Reserved": "bg-purple-100 text-purple-800",
};

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useUser();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<HearingTask | null>(null);

  const {
    tasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    refresh: refreshTasks,
  } = useTasks(id, false);

  useEffect(() => {
    const loadCase = async () => {
      if (!id) return;

      setLoading(true);
      const response = await CaseService.getCase(id);

      if (response.success && response.data) {
        setCaseData(response.data);
      } else {
        navigate("/cases");
      }

      setLoading(false);
    };

    loadCase();
  }, [id, navigate]);

  const handleCreateTask = async (
    data: Omit<HearingTask, "id" | "createdAt" | "updatedAt">,
  ) => {
    await createTask(data);
    setIsTaskFormOpen(false);
  };

  const handleEditTask = async (
    data: Omit<HearingTask, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/cases")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cases
      </Button>

      {/* Case Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{caseData.caseTitle}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={STAGE_COLORS[caseData.stage]}
                >
                  {caseData.stage}
                </Badge>
                <Badge variant="outline">{caseData.caseType}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Client Name</p>
                <p className="text-sm text-muted-foreground">
                  {caseData.clientName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Court</p>
                <p className="text-sm text-muted-foreground">
                  {caseData.courtName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Next Hearing</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(caseData.nextHearingDate), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>

          {caseData.notes && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium mb-2">Note's</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {caseData.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hearing Tasks</h2>
        <Button onClick={() => setIsTaskFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        onEdit={setEditingTask}
        onToggleStatus={toggleTaskStatus}
        onDelete={deleteTask}
        isAdmin={isAdmin}
      />

      {/* Create Task Form */}
      <TaskForm
        caseId={id!}
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        onSubmit={handleCreateTask}
      />

      {/* Edit Task Form */}
      {editingTask && (
        <TaskForm
          caseId={id!}
          initialData={editingTask}
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          isEdit
        />
      )}
    </div>
  );
}
