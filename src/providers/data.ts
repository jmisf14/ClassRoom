import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import type {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { API_URL } from "./constants";
import { mockSubjects } from "@/mocks/subjects";

const { dataProvider: restDataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});

export { kyInstance };

export const dataProvider: DataProvider = {
  ...restDataProvider,
  getApiUrl: () => API_URL,
  getOne: async () => {
    throw new Error("This function is not present in mock");
  },
  create: async () => {
    throw new Error("This function is not present in mock");
  },
  update: async () => {
    throw new Error("This function is not present in mock");
  },
  deleteOne: async () => {
    throw new Error("This function is not present in mock");
  },
  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<GetListResponse<TData>> => {
    const { resource } = params;

    // Match your screenshot's intent: only support "subjects" for now.
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    // Mock list for subjects
    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length,
    };
  },
};
