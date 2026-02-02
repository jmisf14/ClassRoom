import { createDataProvider, type CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import type { ListResponse } from "@/Types";

// Our backend serves resources under /api (e.g. GET /api/subjects)
if (!BACKEND_BASE_URL) {
  throw new Error("VITE_BACKEND_BASE_URL is not set (see classroom-frontend/src/constants).");
}

const API_URL = `${BACKEND_BASE_URL}/api`;

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        if (!("field" in filter) || typeof filter.field !== "string") return;
        const field = filter.field;
        const value = String((filter as { value?: unknown }).value ?? "");
        if (!value) return;

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          // Backend supports a single `search` param (matches name OR code)
          if (field === "name" || field === "code") params.search = value;
        }
      });


      fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H4",
          location: "src/providers/data.ts:buildQueryParams",
          message: "buildQueryParams computed",
          data: { resource, page, pageSize, params },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion agent log

      return params;
    },

    mapResponse: async (response: Response) => {

      fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H3",
          location: "src/providers/data.ts:mapResponse",
          message: "mapResponse called",
          data: { status: response.status, url: response.url },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion agent log

      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async (response: Response) => {

      fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H3",
          location: "src/providers/data.ts:getTotalCount",
          message: "getTotalCount called",
          data: { status: response.status, url: response.url },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion agent log

      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(API_URL, options);

export { dataProvider };