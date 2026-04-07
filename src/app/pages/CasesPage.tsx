// Cases page with list and filters

import { useState } from "react";
import { CaseFilters } from "../types";
import { useCases } from "../hooks/useCases";
import { useUser } from "../hooks/useUser";
import { CaseFilters as CaseFiltersComponent } from "../components/CaseFilters";
import { CaseList } from "../components/CaseList";
import { CaseForm } from "../components/CaseForm";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Skeleton } from "../components/ui/skeleton";
import { Plus } from "lucide-react";
import { Case } from "../types";

export function CasesPage() {
  const [filters, setFilters] = useState<CaseFilters>({});
  const { cases, loading, createCase, updateCase, deleteCase } = useCases(filters, false);
  const { isAdmin } = useUser();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const handleCreate = async (data: Omit<Case, "id" | "createdAt" | "updatedAt">) => {
    await createCase(data);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = async (data: Omit<Case, "id" | "createdAt" | "updatedAt">) => {
    if (editingCase) {
      await updateCase(editingCase.id, data);
      setEditingCase(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCase(id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground mt-2">
            Manage case intake records and track case progression
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CaseForm onSubmit={handleCreate} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <CaseFiltersComponent onFiltersChange={setFilters} />

      {/* Cases List */}
      <CaseList 
        cases={cases} 
        onEdit={setEditingCase}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

      {/* Edit Dialog */}
      {editingCase && (
        <Dialog open={!!editingCase} onOpenChange={() => setEditingCase(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CaseForm
              initialData={editingCase}
              onSubmit={handleEdit}
              onCancel={() => setEditingCase(null)}
              isEdit
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
