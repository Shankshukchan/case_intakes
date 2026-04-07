// Case form component for create/edit operations

import { useState, useEffect } from "react";
import { Case, CaseStage } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface CaseFormProps {
  initialData?: Case;
  onSubmit: (data: Omit<Case, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const STAGES: CaseStage[] = ["Filing", "Evidence", "Arguments", "Order Reserved"];

const CASE_TYPES = [
  "Civil",
  "Criminal",
  "Family",
  "Corporate",
  "Property",
  "Labor",
  "Constitutional",
  "Tax",
  "Other",
];

export function CaseForm({ initialData, onSubmit, onCancel, isEdit = false }: CaseFormProps) {
  const [formData, setFormData] = useState({
    caseTitle: initialData?.caseTitle || "",
    clientName: initialData?.clientName || "",
    courtName: initialData?.courtName || "",
    caseType: initialData?.caseType || "",
    nextHearingDate: initialData?.nextHearingDate?.split("T")[0] || "",
    stage: initialData?.stage || ("" as CaseStage),
    notes: initialData?.notes || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.caseTitle.trim()) {
      newErrors.caseTitle = "Case title is required";
    } else if (formData.caseTitle.trim().length < 3) {
      newErrors.caseTitle = "Case title must be at least 3 characters";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.courtName.trim()) {
      newErrors.courtName = "Court name is required";
    }

    if (!formData.caseType) {
      newErrors.caseType = "Case type is required";
    }

    if (!formData.nextHearingDate) {
      newErrors.nextHearingDate = "Next hearing date is required";
    }

    if (!formData.stage) {
      newErrors.stage = "Stage is required";
    }

    if (formData.notes.length > 1000) {
      newErrors.notes = "Notes cannot exceed 1000 characters";
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
        nextHearingDate: new Date(formData.nextHearingDate).toISOString(),
      });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Case" : "Create New Case"}</CardTitle>
        <CardDescription>
          {isEdit 
            ? "Update the case information below" 
            : "Fill in the details to create a new case"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Case Title */}
          <div>
            <Label htmlFor="caseTitle">
              Case Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="caseTitle"
              value={formData.caseTitle}
              onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
              placeholder="e.g., Smith vs. Corporation XYZ"
              className="mt-1.5"
            />
            {errors.caseTitle && (
              <p className="text-sm text-red-600 mt-1">{errors.caseTitle}</p>
            )}
          </div>

          {/* Client Name */}
          <div>
            <Label htmlFor="clientName">
              Client Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Full name of the client"
              className="mt-1.5"
            />
            {errors.clientName && (
              <p className="text-sm text-red-600 mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Court Name */}
          <div>
            <Label htmlFor="courtName">
              Court Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="courtName"
              value={formData.courtName}
              onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
              placeholder="e.g., District Court, Mumbai"
              className="mt-1.5"
            />
            {errors.courtName && (
              <p className="text-sm text-red-600 mt-1">{errors.courtName}</p>
            )}
          </div>

          {/* Case Type */}
          <div>
            <Label htmlFor="caseType">
              Case Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.caseType}
              onValueChange={(value) => setFormData({ ...formData, caseType: value })}
            >
              <SelectTrigger id="caseType" className="mt-1.5">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {CASE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.caseType && (
              <p className="text-sm text-red-600 mt-1">{errors.caseType}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Next Hearing Date */}
            <div>
              <Label htmlFor="nextHearingDate">
                Next Hearing Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nextHearingDate"
                type="date"
                value={formData.nextHearingDate}
                onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                className="mt-1.5"
              />
              {errors.nextHearingDate && (
                <p className="text-sm text-red-600 mt-1">{errors.nextHearingDate}</p>
              )}
            </div>

            {/* Stage */}
            <div>
              <Label htmlFor="stage">
                Stage <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData({ ...formData, stage: value as CaseStage })}
              >
                <SelectTrigger id="stage" className="mt-1.5">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stage && (
                <p className="text-sm text-red-600 mt-1">{errors.stage}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional case notes and details..."
              rows={4}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.notes.length}/1000 characters
            </p>
            {errors.notes && (
              <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update Case" : "Create Case"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
