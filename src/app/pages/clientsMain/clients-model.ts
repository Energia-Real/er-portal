export interface DataTableResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  data: DataClientsTable[]
}

export interface DataClientsTable {
  id: string;
  clientId: number;
  nombre: string;
}

export interface DataPostPatchClient {
  id?: string;
  clientId?: number;
  nombre?: string;
}

export interface DataPostPatchTypeClient {
  id?: string;
  description: string;
}
