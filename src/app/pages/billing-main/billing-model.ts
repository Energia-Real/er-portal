export interface DataTableBillingResponse {
  response: BillingResponse;
  errors: any[];
}

export interface BillingResponse {
  pageSize: number;
  page: number;
  data: BillingData[];
  totalItems: number;
  errors?: any | null;
}

export interface BillingData {
  externalId: string;
  plant: PlantInfo;
  client: ClientInfo;
  generatedEnergyKwh: number;
  amount: BillingAmount;
  billingMonth: string;
  billingYear: string;
  rate: number;
  status: string;
}

export interface PlantInfo {
  plantId: string;
  plantName: string;
  rpu: string;
}

export interface ClientInfo {
  clientId: string;
  clientName: string;
}

export interface BillingAmount {
  subtotal: number;
  iva: IVA;
  total: number;
}

export interface IVA {
  percentage: number;
  value: number;
}

export interface DataBillingTable {
  externalId: string;
  plantName: string;
  clientName: string;
  billingMonth: string;
  plantId: string;
  rate: number;
  amount: number;
  iva: number;
  amountWithIva: number;
  rpu: string;
  status: string;
  month: string;
  generatedEnergyKwh: number;
  originalGeneratedEnergyKwh: number;
  formattedGeneratedEnergyKwh: string;
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

export interface FiltersBilling {
  clientId?: any
  startDate: string;
  endDate: string | null;
  plantName: string;
  pageSize: number;
  page: number;
}


export interface CreateInvoice {
  clientId: string;
  startDate: string;
  endDate: string;
}

export interface BillingPeriod {
  month: string;
  year: number;
}

export interface EditInvoice {
  generatedEnergyKwh: number;
  amount: InvoiceAmount;
  rate: number;
  billingPeriod?: BillingPeriod;
}

export interface UpdateInvoiceStatus {
  status: string;
}
export interface UpdateMultipleInvoiceStatuses {
  invoiceIds: string[];
  status: string;
}

export interface UpdateMultipleInvoiceStatusesResponse {
  success: boolean;
  response: {
    updatedInvoices: InvoiceUpdate[];
  };
  errors: InvoiceError[];
}

export interface InvoiceUpdate {
  invoiceId: string;
  status: string;
}

export interface InvoiceError {
  invoiceId: string;
  type: string
  description: string;
}

export interface InvoiceResponse {
  success: boolean;
  response: InvoiceDetails;
  errors: string[];
}

interface InvoiceDetails {
  externalId: string;
  plant: PlantDetails;
  client: ClientDetails;
  generatedEnergyKwh: number;
  amount: InvoiceAmount;
  billingMonth: string;
  billingYear: string;
  rate: number;
  status: string;
}

interface PlantDetails {
  plantId: string;
  plantName: string;
  rpu: string;
}

interface ClientDetails {
  clientId: string;
  clientName: string;
}

interface InvoiceAmount {
  subtotal: number;
  iva: IVA;
  total: number;
}
