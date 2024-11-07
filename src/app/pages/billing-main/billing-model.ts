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
  rate: string;
  amount: string;
  amountWithIva: string;
  rpu: string;
  month: number;
  formattedMonth: string;
  generatedEnergyKwh: string;
  formattedGeneratedEnergyKwh: string;
  originalGeneratedEnergyKwh: string;
  formattedAmount: string;
  formattedAmountWithIva: string;
  formattedRate: string;
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
