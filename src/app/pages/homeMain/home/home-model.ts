import { ErrorRequest } from "@app/shared/models/general-models";


export interface FiltersClients {
  months: string[]
  requestType: string;
}



export interface SavingDetailsResponse {
  success: boolean,
  response: SDResponse,
  errors: {
    errors: ErrorRequest[]
  }
}

export interface SDResponse {
  cfeCostWithoutSolar: number | string
  totalEnergyConsumption : number | string
  totalEnergyProduction : number | string
  totalSavings : number | string
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Co2Saving {
  success: boolean;
  response: Co2SavingResponse
  errors: any | null;
}

export interface Co2SavingResponse {
  co2_saving_tCO2: string;
  tree_equivalent: string;
  ev_charges_equivalent: string;
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
  solarCoverage: number;
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
  state : string;
  plants: string;
  totalInstalledCapacity: number;
  tco2Savings: string;
}

export interface MapStatesResponse{
  kwhByStateResponse: statesResumeTooltip[]
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

export interface EconomicSavings {
  cfeSubtotal: number;
  energiaRealSubtotal: number;
  economicSaving: number;
  expensesWithoutEnergiaReal: number;
}
