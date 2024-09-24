export interface DataTableBillingResponse {
  success: boolean,
  response: {
    billingPagedResponse: {
      pageSize: number,
      page: number,
      data: DataBillingTable[],
      totalItems: 0
    }
  },
  errors: {
    errors: ErrorRequest[]
  }
}

export interface DataBillingTable {
  id : string,
  siteName :string,
  clientName :string,
  billing :number
}

export interface ErrorRequest {
  tipo: string;
  field: string;
  descripcion: string;
}

export interface DataBillingTableMapper {
  pageSize: number,
  page: number,
  data: DataBillingTable[],
  totalItems: 0
}