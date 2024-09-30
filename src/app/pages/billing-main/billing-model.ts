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
  externalId : string;
  plantName : string;
  clientName : string;
  amount : number;
  amountWithIva : number;
  rpu : string;
  generatedEnergyKwh : number;
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