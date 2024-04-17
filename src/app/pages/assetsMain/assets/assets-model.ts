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

export interface DataResponseDescription {
  success: true,
  errorMessage: string,
  errorCode: 0,
  data: {
      title: string,
      value: string
    }[]
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

export interface DataResponseSystem {
  success: true,
  errorMessage: string,
  errorCode: 0,
  data: {
      real_health_state: string, //1: disconnected, 2: faulty, 3: healthy
      day_power: string
      total_power: string //SystemSize
      day_income: string
      month_power: string
      total_income: string
    }[]
}