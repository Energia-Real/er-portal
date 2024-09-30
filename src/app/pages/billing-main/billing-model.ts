export interface DataTableBillingResponse {
  response: {
    pageSize: number;
    page: number;
    data: DataBillingTable[];
    totalItems: number;
  };
  errors?: ErrorRequest[];
}


export interface DataBillingTable {
  externalId: string;
  plantName: string;
  clientName: string;
  amount: number;
  amountWithIva: number;
  rpu: string;
  generatedEnergyKwh: number;
}

export interface DataBillingTableMapper {
  pageSize: number,
  page: number,
  data: DataBillingTable[],
  totalItems: number
}

export interface ErrorRequest {
  message: string;
  code: string;
}
