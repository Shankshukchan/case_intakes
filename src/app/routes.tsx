// React Router configuration

import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { CasesPage } from "./pages/CasesPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "cases",
        Component: CasesPage,
      },
      {
        path: "cases/:id",
        Component: CaseDetailPage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);