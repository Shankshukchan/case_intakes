// Data management controls for demo purposes

import { useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { RotateCcw, Database } from "lucide-react";
import { toast } from "sonner";

export function DataControls() {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      // Simply reload the page to refresh data from backend
      toast.success("Refreshing data from backend...");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Failed to refresh data");
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="shadow-lg">
            <Database className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refresh Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will reload all data from the server. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetData} disabled={isResetting}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {isResetting ? "Refreshing..." : "Refresh Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
