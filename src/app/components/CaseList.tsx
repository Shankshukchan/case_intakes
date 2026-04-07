// Case list component with table view

import { Case } from "../types";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card } from "./ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CaseListProps {
  cases: Case[];
  onEdit: (caseData: Case) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  "Filing": "bg-blue-100 text-blue-800",
  "Evidence": "bg-yellow-100 text-yellow-800",
  "Arguments": "bg-orange-100 text-orange-800",
  "Order Reserved": "bg-purple-100 text-purple-800",
};

export function CaseList({ cases, onEdit, onDelete, isAdmin }: CaseListProps) {
  const navigate = useNavigate();

  if (cases.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <Eye className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No cases found</h3>
        <p className="text-muted-foreground mb-4">
          No cases match your current filters. Try adjusting your search criteria.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Next Hearing</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseData) => (
              <TableRow key={caseData.id}>
                <TableCell className="font-medium">{caseData.caseTitle}</TableCell>
                <TableCell>{caseData.clientName}</TableCell>
                <TableCell>{caseData.courtName}</TableCell>
                <TableCell>{caseData.caseType}</TableCell>
                <TableCell>
                  {format(new Date(caseData.nextHearingDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={STAGE_COLORS[caseData.stage]}>
                    {caseData.stage}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/cases/${caseData.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(caseData)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {isAdmin ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Case</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{caseData.caseTitle}"? This will also delete all associated tasks. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(caseData.id)}
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
                        title="Only admins can delete cases"
                        className="text-gray-400 cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
