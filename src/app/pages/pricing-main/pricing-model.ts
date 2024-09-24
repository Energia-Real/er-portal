export interface DataTablePricingResponse {
  success: boolean,
  response: {
    pricingPagedResponse: {
      pageSize: number,
      page: number,
      data: DataPricingTable[],
      totalItems: 0
    }
  },
  errors: {
    errors: ErrorRequest[]
  }
}

export interface DataPricingTable {
  id : string,
  siteName :string,
  clientName :string,
  pricing :number
}

export interface ErrorRequest {
  tipo: string;
  field: string;
  descripcion: string;
}

export interface DataPricingTableMapper {
  pageSize: number,
  page: number,
  data: DataPricingTable[],
  totalItems: 0
}