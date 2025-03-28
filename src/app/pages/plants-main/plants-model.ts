export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface DataRespSavingDetailsList {
  id: string;
  clientId: number;
  nombre: string;
}

export interface FiltersPlants {
  name: string;
  pageSize: number;
  page: number;
}

export interface Example {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface PostDataByPlant {
  brand: string;
  plantCode: string;
}

export interface getSavingsDetailsMapper {
  cfeSubtotal: string;
  erCfeSubtotal: string;
  erSubtotal: string;
  expenditureWithoutEr: string;
  savings: string;
}
export interface getSavingsDetails {

    cfeSubtotal: string;
    erSubtotal: string;
    erCfeSubtotal:string;
    expenditureWithoutER: string;
    savings: string;
    monthlyData: monthlyData[]
}

export interface monthlyData {
  year: string;
  month: string;
  cfeSubtotal: string;
  erSubtotal: string;
  expenditureWithoutER: string;
  savings: string
}

export interface DataResponseDetailsClient {
  id: string
  subClientId: number
  siteName: string
  ageOfTheSite: number
  clientName: string
  mountingTechnology: string
  nominalPower: string
  rpu: string
  roofType: string
  systemSize: number
  direction: any
  longitude: number
  contractType: string
  installationType: string
  commissionDate: any
  clientId: any
  inverterQty: number
  netZero: any
  assetStatus: string
  latitude: number
  link: string
  plantCode: string
  inverterBrand: string[]
  endInstallationDate: any
  contractSignatureDate: any
}

export interface DataResponseDetails {
  success: true,
  errorMessage: string,
  errorCode: 0,
  data: {
    title: string,
    value: string
  }[]
}

export interface DataDetails {
  title: string,
  value: string
}

export interface DataManagementTableResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  data: DataManagementTable[]
}

export interface DataManagementTable {
  id: string;
  siteName: string;
  systemSize: string;
  direction: string;
  longitude: number
  contractType: string;
  installationType: string;
  commissionDate: string;
  numberOfInvestors: any;
  clientId: number;
  inverterQty: number;
  netZero: boolean
  assetStatus: string;
  latitude: boolean
  link: string;
  plantCode: string;
  inverterBrand: string[],
  subClientId: number
  endInstallationDate: string;
  contractSignatureDate: string;
  rpu: string;
  clientName: string;
  nominalPower: number
  mountingTechnology: string;
  roofType: string;
  ageOfTheSite: number;
  instalaciones: {
    instalacionId: number;
    moduloQty: number;
    moduloBrand: any;
    moduloModel: any;
  }[];
}

export interface DataResponseDetailsCard {
  title: string;
  description: string | Date | null;
  tooltip?: string
  icon?: string
  extra?:string;
}
export interface DataResponseArraysMapper {
  primaryElements: any[];
  additionalItems: any[];
  monthlyData?: MonthlyDataPerformance[];
}

export interface DataSiteDetails {
  lastConnectionTimestamp: string;
  systemSize: number;
  panels: number;
  contractDuration: {
    years: number;
    months: number;
    days: number;
  },
  rpu: string;
  ageOfTheSite: number;
  installDate: string;
  cod: string
  commissionDate: string
}

export interface ResponseSystem {
  success: true,
  errorMessage: string,
  errorCode: 0,
  data: DataResponseSystem
}

export interface DataResponseSystem {
  real_health_state: string
  day_power: string
  total_power: string
  day_income: string
  month_power: string
  total_income: string
}

export interface DataPlant {
  id: string;
  clientId: string;
  siteName: string;
  clientName: string;
  subClientId: string;
  systemSize: number,
  direction: string;
  longitude: number,
  contractType: string,
  descriptionStatus: string,
  installationType: string,
  commissionDate: string,
  inverterQty: number,
  netZero: boolean,
  assetStatus: string,
  latitude: number,
  link: string,
  plantCode: string,
  inverterBrand: string[]
  contractSignatureDate: string
  endInstallationDate: string
  mountingTechnology: string
  nominalPowerAC: string
  roofType: string
  rpu: string
  assetStatusIcon: string
  assetStatusIconTest: string
  instalaciones: {
    instalacionId: number;
    moduloQty: number;
    moduloBrand: any;
    moduloModel: any;
  }[];
}

export interface DataPostPatchPlant {
  id?: string;
  clientId?: string;
  siteName?: string;
  clientName?: string;
  subClientId?: string;
  systemSize?: number,
  direction?: string;
  longitude?: number,
  contractType?: string,
  descriptionStatus?: string,
  installationType?: string,
  commissionDate?: string,
  inverterQty?: number,
  netZero?: boolean,
  assetStatus?: string,
  latitude?: number,
  link?: string,
  plantCode?: string,
  inverterBrand?: string[]
  contractSignatureDate?: string
  endInstallationDate?: string
  mountingTechnology?: string
  nominalPowerAC?: string
  roofType?: string
  rpu?: string
  assetStatusIcon?: string
  assetStatusIconTest?: string
  instalaciones?: {
    instalacionId?: number;
    moduloQty?: number;
    moduloBrand?: any;
    moduloModel?: any;
  }[];
}
export interface DataLocalTime {
  dstOffset: number;
  rawOffset: number;
  status: string;
  timeZoneId: string;
  timeZoneName: string;
}

export interface DataLocalTimeMapper {
  dstOffset: number;
  rawOffset: number;
  status: string;
  timeZoneId: string;
  timeZoneName: string;
}

export interface DataSummaryProjectsMapper {
  noOfSites: string;
  noOfModules: string;
  noOfInverters: string;
  mWpInstalled: string;
}

export interface DataSummaryProjects {
  siteName: string;
  plantCode: string;
  direction: string;
  link: string;
  contractTypeId: string;
  latitude: number
  longitude: number
  installationTypeId: string;
  commissionDate: string;
  installedCapacity: string;
  contractSignatureDate: string;
  endInstallationDate: string;
  systemSize: number
  inverterQty: number
}

export interface EstimatedEnergy {
  collectTime: Date
  inverterPower: number
  estimatedEnergyMWh: number
}

export interface ProyectResume {
  _id: Id
  brandName: string
  stationCode: string
  repliedDateTime: string
  monthresume: Monthresume[]
}

export interface Id {
  timestamp: number
  machine: number
  pid: number
  increment: number
  creationTime: string
}

export interface Monthresume {
  collectTime: string
  installedCapacity: number
  usePower: number
  inverterPower: number
  selfUsePower: number
  reductionTotalCoal: number
  reductionTotalCo2: number
  onGridPower: number
  buyPower: number
  selfProvide: number
  perPowerRatio?: number
  dataRecovery: number
}


export interface ProjectStatus {
  endInstallationDate: string
  systemSize: number
  siteName: string
  siteId: string
  estatusDeLaPlantaId: number
}

export interface Module {
  instalacionId: number
  moduloQty: number
  moduloBrand: string
  moduloModel: string
}

export interface Instalations {
  id: string
  mountingTechnology: string
  roofType: string
  equipment: Equipment[]
  equipmentPath: string
}

export interface InverterMonitoring {
  inverterSystemStatus: boolean,
  inverterSystemMessage: string,
  invertersStatus: {
    sn: string,
    status: boolean,
    statusMessage: string
  }[],
  equipment: any[]
}

export interface Equipment {
  equipmentId?: string | number | null | undefined
  moduloQty?: number
  moduloBrand?: string
  moduloBrandId?: number
  moduloModel?: string
  tilt?: number
  orientation?: number
  projectExternalId?: string
  inverterBrand?: string
  inverterBrandId?: number
  inverterModel?: string
  inverterModelId?: number
  moduloModelId?: number
  description?: string
  title?: string
  serialNumber?: string
}

export interface CatalogEquipment {
  id?: number
  nombre?: string
}

export interface SitePerformanceResponse {
    systemGeneration: number;
    totalConsumption: number;
    solarCoverage: number;
    performance: number; 
    cfeNetworkConsumption: number; 
    exportedGeneration?: number;
    monthlyDataResponse:MonthlyDataPerformance[]

} 

export interface MonthlyDataPerformance{
  month: number; 
  consumption: number; 
  generation: number;
  exportedGeneration: number; 
  cfeConsumption: number; 
}
  

export interface BatuSummary {
  summary: number
}
