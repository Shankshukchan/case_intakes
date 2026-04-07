// Task form component for create/edit operations

import { useState } from "react";
import { HearingTask, TaskPriority } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface TaskFormProps {
  caseId: string;
  initialData?: HearingTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<HearingTask, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  isEdit?: boolean;
}

const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

export function TaskForm({ 
  caseId, 
  initialData, 
  open, 
  onOpenChange, 
  onSubmit, 
  isEdit = false 
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    dueDate: initialData?.dueDate?.split("T")[0] || "",
    ownerName: initialData?.ownerName || "",
    priority: initialData?.priority || ("" as TaskPriority),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        caseId,
        status: initialData?.status || "Pending",
        dueDate: new Date(formData.dueDate).toISOString(),
      });
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: "",
        dueDate: "",
        ownerName: "",
        priority: "" as TaskPriority,
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the task details below" 
              : "Add a new hearing preparation task"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <Label htmlFor="title">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Prepare witness list"
              className="mt-1.5"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <Label htmlFor="ownerName">
              Owner Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Person responsible for this task"
              className="mt-1.5"
            />
            {errors.ownerName && (
              <p className="text-sm text-red-600 mt-1">{errors.ownerName}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1.5"
              />
              {errors.dueDate && (
                <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
              >
                <SelectTrigger id="priority" className="mt-1.5">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
