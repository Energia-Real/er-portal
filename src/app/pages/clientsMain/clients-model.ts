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

export interface DataPostTypeClient {
  id?: string;
  description?: string;
}
export interface DataPatchTypeClient {
  id?: string;
  tipo: string;
}

export interface DataPostClient {
  name: string,
  tipoDeClienteId: string
}
export interface DataPatchClient {
  clientId:  number
  name: string,
  tipoDeClienteId: string
}

export interface DataCatalogTypeClient {
  id: string;
  description: string;
  tipo: string;
}
