
export type ProcessType = 'validate' | 'execute' | 'upload' | 'result';
export type StatusType = 'start' | 'success' | 'error';

export interface FinantialDataModelStepper {
  file: File | null
}

export interface WebSocketResponse{ 
  errors: { [key: string]: string[] } 
  process: ProcessType
  status: StatusType
  scenario?: number
  scenarios?: number
  output_file_uuid?: string
}