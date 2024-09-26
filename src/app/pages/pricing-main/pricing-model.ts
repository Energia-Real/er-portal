export interface DataTablePricingResponse {
  success: boolean;
  response: {
    pricingPagedResponse: {
      pageSize: number;
      page: number;
      data: DataPricingTable[];
      totalItems: 0
    }
  },
  errors: {
    errors: ErrorRequest[]
  }
}

export interface DataPricingTable {
  plantId : string;
  clientId : string;
  externalId : string;
  plantName :string;
  clientName :string;
  rpu :string;
  kwh :number;
  month :number;
  year :number;
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