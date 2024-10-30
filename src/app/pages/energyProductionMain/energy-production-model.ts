export interface DataTableEnergyProdResponse {
  response: {
    pageSize: number;
    page: number;
    data: DataEnergyProdTable[];
    totalItems: number;
  };
  errors?: ErrorRequest[];
}

export interface DataEnergyProdTable {
  id: string;
  siteName: string;
  energyProdMonth1: number;
  energyProdMonth2: number;
  energyProdMonth3: number;
  energyProdMonth4: number;
  energyProdMonth5: number;
  energyProdMonth6: number;
  energyProdMonth7: number;
  energyProdMonth8: number;
  energyProdMonth9: number;
  energyProdMonth10: number;
  energyProdMonth11: number;
  energyProdMonth12: number;
  isCreated: boolean;
}


export interface DataTableEnergyEstResponse {
  success: boolean,
  response: {
      pageSize: number,
      page: number,
      data: DataEnergyEstTable[],
      totalItems: number
  },
  errors: {
    errors: ErrorRequest[]
  }
}

export interface DataEnergyEstTable {
  id: string;
  siteName: string;
  energyEstMonth1: number;
  energyEstMonth2: number;
  energyEstMonth3: number;
  energyEstMonth4: number;
  energyEstMonth5: number;
  energyEstMonth6: number;
  energyEstMonth7: number;
  energyEstMonth8: number;
  energyEstMonth9: number;
  energyEstMonth10: number;
  energyEstMonth11: number;
  energyEstMonth12: number;
  isCreated: boolean;
}

export interface DataEnergyProdTablMapper {
  pageSize: number,
  page: number,
  data: DataEnergyProdTable[],
  totalItems: number
}

export interface DataEnergyProdTablMapper {
  pageSize: number,
  page: number,
  data: DataEnergyProdTable[],
  totalItems: number
}


export interface DataPostEnergyProd {
  id: string;
  monthSelected: number;
  year: number;
  energyProduced: number;
}

export interface DataPatchEnergyProd {
  id: string;
  monthSelected: number;
  year: number;
  energyProduced: number;
  deleteEnergyProd: true;
}

export interface ErrorRequest {
  tipo: string;
  field: string;
  descripcion: string;
}