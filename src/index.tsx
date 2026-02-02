import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";


window.addEventListener("error", (event) => {
  fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "src/index.tsx:ERR",
      message: "window.error",
      data: {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => { });
});

window.addEventListener("unhandledrejection", (event) => {
  fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "src/index.tsx:REJ",
      message: "window.unhandledrejection",
      data: {
        reason: String((event as PromiseRejectionEvent).reason ?? ""),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => { });
});
// #endregion agent log

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
