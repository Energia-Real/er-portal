
export type ProcessType = 'validate' | 'execute' | 'upload' | 'result';
export type StatusType = 'start' | 'success' | 'error';

export interface FinantialDataModelStepper {
  file: File | null
}

export interface WebSocketResponse{ 
  errors: any[]
  process: ProcessType
  status: StatusType
  scenario?: string
  scenarios?: number
}