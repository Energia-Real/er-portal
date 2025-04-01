export interface DataTableEnergyProdResponse {
  response: {
    pageSize: number;
    page: number;
    data: DataEnergyProdTable[];
    totalItems: number;
  };
  errors?: ErrorRequest[];
}

export interface FiltersEnergyProd {
  name: string;
  pageSize: number;
  page: number;
  year: string;
}

export interface DataEnergyProdTable {
  id: string;
  siteName: string;
  energyMonth1: any;
  energyMonth2: any;
  energyMonth3: any;
  energyMonth4: any;
  energyMonth5: any;
  energyMonth6: any;
  energyMonth7: any;
  energyMonth8: any;
  energyMonth9: any;
  energyMonth10: any;
  energyMonth11: any;
  energyMonth12: any;
  annualTotal: any;
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
  energyProduced?: number;
  energyValue?: number;
  deleteEnergyValue: true;
}

export interface ErrorRequest {
  tipo: string;
  field: string;
  descripcion: string;
}