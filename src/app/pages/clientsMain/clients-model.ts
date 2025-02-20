export interface DataTableResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  data: DataClientsTable[]
}


export interface DataClientsTable {
  id: string;
  clientId: number;
  nombre: string;
  imageBase64: string;
  razonSocialCount: number; 
  razonesSociales: DataRazonSocial[]
}

export interface DataRazonSocial{
  externalId: number; 
  razonSocialName: string; 
  rfc: string; 
}

export interface DataPostPatchClient {
  id?: string;
  clientId?: number;
  nombre?: string;
}

export interface DataPostTypeClient {
  id?: string;
  description?: string;
}
export interface DataPatchTypeClient {
  id?: string;
  tipo: string;
}

export interface DataPostClient {
  name: string,
  tipoDeClienteId: string
  image: any
  clientId?: string
}

export interface DataPostRazonSocial {
  id?: string;
  corporateName: string,
  plantsIds: string[],
  rfc: string
}

export interface DataPatchClient {
  clientId:  string
  name: string,
  tipoDeClienteId: string
  image?: any
}

export interface DataCatalogTypeClient {
  id: string;
  description: string;
  tipo: string;
}

export interface DataCientList {
  id: string;
  clientId: number;
  nombre: string;
  razonSocialCount: number;
  plantsCount: number; 
  imageBase64: string;
  tipoDeCliente: TipoDeCliente;
}

export interface DataCorporateResponse{
  data: corporate[]
}

export interface corporate{
  id:string,
  internalClientId: number,
  corporateName: string,
  rfc: string,
  plants: corporatePlant[]
}

export interface corporatePlant{
  id:number,
  externalId:string,
  plantName: string, 
  
  internalPlantId?: number
}

export interface TipoDeCliente{
  id: string;
  tipo: string; 
}

export interface DataPlantWhitoutCorporateResponse{
  projects: PlantWhitoutCorporate[]
}

export interface PlantWhitoutCorporate{
  siteName: string; 
  externalId: string; 
  internalId: number;
  
}