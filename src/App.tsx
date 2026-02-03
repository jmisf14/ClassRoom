import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/dashboard";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import ClassesList from "./pages/classes/lists";
import ClassesCreate from "./pages/classes/classes";
import { Layout } from "./components/refine-ui/layout/layout";
import { BookOpen, GraduationCap } from "lucide-react";
import { dataProvider } from "@/providers/data.ts";

function App() {
  fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "src/App.tsx:App",
      message: "App render",
      data: { pathname: window.location?.pathname },
      timestamp: Date.now(),
    }),
  }).catch(() => { });
  

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "E1YWHx-uZQMx9-3tsUFn",
              }}
              resources={[
                {
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  meta: { label: 'Subjects', icon: <BookOpen /> }

                },
                {
                  name: 'classes',
                  list: '/classes',
                  create: '/classes/create',
                  meta: { label: 'Classes', icon: <GraduationCap/> }
                }
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet />
                    <Toaster />
                  </Layout>
                }>
                  <Route path="/" element={<Dashboard />} />
                </Route>
                <Route path="subjects">
                  <Route index element={<SubjectsList />} />
                  <Route path="create" element={<SubjectsCreate />} />
                </Route>
                <Route path="classes">
                  <Route index element={<ClassesList />} />
                  <Route path="create" element={<ClassesCreate />} />
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
