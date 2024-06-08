
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
  solarCoverage: number;
  co2Saving: number;
  energyProduction: string;
  energyConsumption: string;
}

export interface DataRespSavingDetailsMapper {
  data: DataRespSavingDetails[];
  savingDetails : {
    totalEnergyConsumption: string;
    totalEnergyProduction: string;
  }
}

export interface DataRespSavingDetailsList {
  id: string;
  clientId: number;
  nombre: string;
}