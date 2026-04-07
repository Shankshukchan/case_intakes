import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import { useEffect } from "react";
import { initializeSeedData } from "./utils/seedData";

export default function App() {
  useEffect(() => {
    // Initialize demo data on first load
    initializeSeedData();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}