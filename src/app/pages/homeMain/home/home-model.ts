
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

export interface DataRespSavingDetailsList {
  id: string;
  clientId: number;
  nombre: string;
}

export interface Month {
  value: string;
  viewValue: string;
}

export interface DataSolarCovergaCo2 {
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
