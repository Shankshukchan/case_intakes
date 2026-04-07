// Task list component

import { HearingTask, TaskPriority } from "../types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Pencil, Trash2, ListTodo } from "lucide-react";
import { format } from "date-fns";

interface TaskListProps {
  tasks: HearingTask[];
  onEdit: (task: HearingTask) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  "Low": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "High": "bg-red-100 text-red-800",
};

export function TaskList({ tasks, onEdit, onToggleStatus, onDelete, isAdmin }: TaskListProps) {
  const pendingTasks = tasks.filter(t => t.status === "Pending");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No tasks yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first hearing preparation task
          </p>
        </CardContent>
      </Card>
    );
  }

  const TaskSection = ({ title, tasks, isPending }: { title: string; tasks: HearingTask[]; isPending: boolean }) => {
    if (tasks.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {title} ({tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={task.status === "Completed"}
                  onCheckedChange={() => onToggleStatus(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {task.ownerName}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                        </span>
                        <Badge variant="secondary" className={`${PRIORITY_COLORS[task.priority]} text-xs`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(task)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      
                      {isAdmin ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{task.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(task.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          title="Only admins can delete tasks"
                          className="text-gray-400 cursor-not-allowed"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <TaskSection title="Pending Tasks" tasks={pendingTasks} isPending={true} />
      <TaskSection title="Completed Tasks" tasks={completedTasks} isPending={false} />
    </div>
  );
}
