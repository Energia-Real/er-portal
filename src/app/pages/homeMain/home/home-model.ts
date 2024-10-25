
export interface FiltersSavingDetails {
  clientId?:any
  startDate: string;
  endDate: string | null;
}

export interface SavingDetailsResponse {
  totalEnergyConsumption: string;
  totalEnergyProduction: string;
  cfeCostWithoutSolar: string;
  totalSavings: string;
}

export interface filtersSolarCoverage {
  brand: string;
  clientName: string;
  months: string[];
  requestType: number;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface DataRespSavingDetails {
  siteId: string;
  siteName: string;
  siteSaving: number;
  cfeZone: number;
  solarCoverage: number | string;
  co2Saving: number | string;
  energyProduction: string;
  energyConsumption: string;
  siteStatus: string;
}

export interface DataRespSavingDetailsMapper {
  data: DataRespSavingDetails[];
  savingDetails: {
    totalEnergyConsumption: string;
    totalEnergyProduction: string;
  }
}

export interface statesResumeTooltip {
  estado : string;
  plantas: number;
  totalEnergyProduction: number;
}

export interface DataRespSavingDetailsList {
  id: string;
  clientId: number;
  nombre: string;
  imageBase64?: any;
}

export interface Month {
  value: string;
  viewValue: string;
}

export interface DataSolarCoverga {
  success: boolean;
  errorMessage: string;
  errorCode: 204,
  data: [
    {
      title: string;
      value: string
    }
  ]
}

export interface FormatCards {
  title: string;
  value: any;
}[]
