import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import type {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { API_URL } from "./constants";

const { dataProvider: restDataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});

export { kyInstance };

export const dataProvider: DataProvider = {
  ...restDataProvider,
  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams,
  ): Promise<GetListResponse<TData>> => {
    const { resource } = params;

    // Match your screenshot's intent: only support "subjects" for now.
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    // Delegate to the REST provider for real data.
    return await restDataProvider.getList<TData>(params);
  },
};
