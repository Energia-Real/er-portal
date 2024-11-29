
export interface GeneralFilters {
  clientId?:any
  startDate: string;
  endDate: string | null;
}

export interface FiltersClients {
  months:string[]
  requestType: string;
}

export interface SavingDetailsResponse {
  totalenergyConsumption: string;
  totalEnergyProduction: string;
  cfeCostWithOutSolar: string;
  totalSavings: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface DataTablePlantsResponse {
  success: boolean;
  response: {
    consolidatedData: PlantData[];
  };
  errors: any | null;
}

export interface PlantData {
  plantId: string;
  siteName: string;
  energyProduction: any;
  energyConsumption: any;
  solarCoverage: number ; 
  co2Saving: any;
  siteStatus: string;
}

export interface DataRespSavingDetails {
  siteId: string;
  siteName: string;
  siteSaving: number;
  cfeZone: number | string;
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

export interface DataSolarCoverage {
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
