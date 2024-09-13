export interface DataTableEnergyProdResponse {
    success: boolean,
    response: {
      energyProducedResponses: DataEnergyProdTable[]
    },
    errors: any
  }
  
  
  export interface DataEnergyProdTable {
    id: string,
    siteName: string;
    energyProdMonth1:  number;
    energyProdMonth2:  number;
    energyProdMonth3:  number;
    energyProdMonth4:  number;
    energyProdMonth5:  number;
    energyProdMonth6:  number;
    energyProdMonth7:  number;
    energyProdMonth8:  number;
    energyProdMonth9:  number;
    energyProdMonth10: number;
    energyProdMonth11: number;
    energyProdMonth12: number;
  }
  
  export interface DataPostEnergyProd {
    id: string,
    monthSelected: number,
    year: number,
    energyProduced: number
  }

  export interface DataPatchEnergyProd {
    id: string,
    monthSelected: number,
    year: number,
    energyProduced: number,
    deleteEnergyProd: true
  }