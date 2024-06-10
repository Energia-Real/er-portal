export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
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

export interface DataResponseDetailsClient {
  id: string
  subClientId: number
  siteName: string
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

export interface DataResponseDetailsMapper {
  title: string;
  description: string | Date;
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
    subClientId :string;
    systemSize: number,
    direction: string;
    longitude: number,
    contractType: string,
    installationType: string,
    commissionDate: string,
    inverterQty: number,
    netZero: boolean,
    assetStatus: string,
    latitude: number,
    link: string,
    plantCode: string ,
    inverterBrand: string[]
    contractSignatureDate : string
    endInstallationDate : string
    mountingTechnology : string
    nominalPower : string
    roofType : string
    rpu : string
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

export interface DataSummaryProjects {
  noOfSites: string;
  noOfModules: string;
  noOfInverters: string;
  mWpInstalled: string;
}

export interface DataSummaryProjects {
  siteName : string;
  plantCode : string;
  direction : string;
  link : string;
  contractTypeId : string;
  latitude : number
  longitude : number
  installationTypeId : string;
  commissionDate : string;
  installedCapacity : string;
  contractSignatureDate : string;
  endInstallationDate : string;
  systemSize : number
  inverterQty : number
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
}


export interface ProjectStatus {
  endInstallationDate: string
  systemSize: number
  siteName: string
  siteId: string
  estatusDeLaPlantaId: number
}
