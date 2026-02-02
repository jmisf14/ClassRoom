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
      return params;
    },

    mapResponse: async (response: Response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async (response: Response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(API_URL, options);

export { dataProvider };