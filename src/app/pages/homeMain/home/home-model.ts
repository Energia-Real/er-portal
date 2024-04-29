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
}