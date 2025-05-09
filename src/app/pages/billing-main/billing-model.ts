import { DataCatalogs } from "@app/shared/models/catalogs-models";

export interface DataTableBillingResponse {
  response: BillingResponse;
  errors: any[];
}

export interface InvoiceDetailsTableRow {
  production: number;
  concept: string;
  description: string;
  unitValue: number;
  taxes: number;
  amount: number;
}

export interface DataBillingSitesTableMapper {
  pageSize: number,
  page: number,
  data: SitesTableRow[],
  totalItems: number
}

export interface SitesTableRow {
  siteName: string;
  clientName: string;
  legalName: string;
  product: string;
  contractType: string;
  status: string;
  address: string;
}


export interface BillingResponse {
  pageSize: number;
  page: number;
  data: BillingData[];
  totalItems: number;
  errors?: any | null;
}

export interface FilterBillingDetails {
  year: number;
  customerName: string;
  legalName?: string;
  siteName?: string;
  productType?: string;
  page?: number;
  pageSize?: number;
}

export interface FilterBillingEnergysummary {
  startDate: string;
  endDate: string;
  customerName?: string;
  legalName?: string;
  siteName?: string;
  productType?: string;
}

export interface EnergyBillingSummary {
  success: boolean;
  response: {
    energySummaryResponse: EnergySummaryResponse;
  };
  errors: any;
}

export interface EnergySummaryResponse {
  months: {
    month: number;
    billedEnergyProduced: number;
    billedEnergy: number;
    billedEnergyAmouth: number;
  }[];
  balance: number;
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
  clienteId: number,
  cliente: string,
  subclienteId: number,
  subcliente: null,
  razonSocial: string,
  esFacturaciónIndividual: boolean,
  month: string,
  year: number,
  rpu: string,
  tarifa: string,
  generatedEnergyKwh: number | string,
  montoTotal: string,
  montoPagoAnterior: any,
  startDate: string,
  endDate: string,
  createdInvoiceDocDate: any
}

export interface PostConfirmInvoices {
  invoiceId: string;
  plantId: string;
  subtotal: number;
  iva: number;
  total: number;
  billingMonth: string;
  billingYear: number;
  status: number;
  rate: number;
  amount: number;
  generatedEnergyKwh: number;
  rpu: string;
  clientName: string;
  plantName: string;
  startDate: string;
  endDate: string;
}

export interface DataBillingOverviewTableMapper {
  pageSize: number,
  page: number,
  data: DataBillingOverviewTable[],
  totalItems: number
}

export interface DataBillingOverviewTable {
  month: string;
  year: string;
  amount: string;
  monthFormatter: string;
  rfc: string;
  razonSocial: string;
}
export interface DataBillingTableMapper {
  pageSize: number,
  page: number,
  data: DataBillingTable[],
  totalItems: number
}

export interface DataHistoryOverviewTableMapper {
  pageSize: number,
  page: number,
  data: DataHistoryOverviewTable[],
  totalItems: number
}

export interface DataHistoryOverviewTable {
  month: string;
  year: string;
  amount: string;
  monthFormatter: string;
  rfc: string;
  razonSocial: string;
}

export interface DataDetailsOverviewTableMapper {
  pageSize: number;
  page: number;
  data: DataDetailsOverviewTable[];
  dataPlants?: DataDetailsOverviewTable[];
  totalItems: number;
}

export interface DataDetailsOverviewTable {
  razonSocial: string;
  rfc: string;
  startPeriod: string;
  endPeriod: string;
  plants: PlantData[]
}

export interface PlantData {
  subclient: string;
  rate: number;
  productionKwh: number;
  previousPayment: number;
  totalAmount: number;
}
export interface ErrorRequest {
  message: string;
  code: string;
}

export interface FiltersBilling {
  clientId?: any
  startDate: string;
  endDate: string | null;
  pageSize: number;
  page: number;
}

export interface UpdateBilling {
  generatedEnergyKwh: number;
  subtotal: number;
  iva: number;
  total: number;
  status: number,
  invoiceId: string
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


export interface CurrentBillResponse {
  currentBillResponse: Bill[]
}

export interface HistoryBillResponse {
  historyBillResponse: Bill[]
}

export interface catalogResponseList {
  catalogResponseList: DataCatalogs[]
}





export interface Bill {
  amount: number;
  billingId: string;
  legalName: string;
  month: number;
  product: string;
  status: string;
  year: number;
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
