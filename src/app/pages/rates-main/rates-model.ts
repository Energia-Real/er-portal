export interface DataTablePricingResponse {
  response: {
    pageSize: number; 
    page: number;   
    data: DataPricingTable[];
    totalItems: number; 
  };
  errors?: ErrorRequest[]; 
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
  message: string;
  code: string;
}

export interface DataPricingTableMapper {
  pageSize: number,
  page: number,
  data: DataPricingTable[],
  totalItems: number
}

export interface FiltersRates {
  clientId?:any
  startDate: string;
  endDate: string | null;
  plantName: string;
  pageSize: number;
  page: number;
}