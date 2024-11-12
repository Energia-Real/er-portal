import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';

export type IForm<T> = {
  [K in keyof T]?: any;
}

export interface DrawerGeneral {
    drawerOpen: boolean;
    drawerAction:  "Create" | "Edit";
    drawerInfo: any;
    needReload: boolean;
}
export interface User {
  id?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
}

export interface UserV2 {
  id: string,
  email: string,
  persona: {
    id: string,
    nombres: string,
    apellidos: string
  },
  clientes: null,
  accessTo: string
}

export interface GeneralFilters {
  clientId?:any
  startDate: string;
  endDate: string | null;
}

export interface DataResponseArraysMapper {
  primaryElements: any[]
  additionalItems: any[]
}

export interface ConfirmationConfig
{
    title?: string;
    message?: string;
    icon?: {
        show?: boolean;
        name?: string;
        color?: 'success' | 'warning' | 'error' | 'question' | 'alert';
    };
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
        };
        cancel?: {
            show?: boolean;
            label?: string;
        };
    };
    dismissible?: boolean;
}


export interface FilterState {
  filters: {
    requestType: string;
    months: string[];
    states?: string[];
  };
  generalFilters: {
    startDate: string;
    endDate: string | null;
  };
  filtersBatu: {
    months: string[];
  };
  filtersSolarCoverage: {
    brand: string;
    clientName: string;
    months: string[];
    requestType: number;
  };
}

export interface notificationData{
  type:     string,
  typeId?:   number|undefined,
  title:    string,
  content?:  string,
  warn?:     string, 
  buttonAction?: string
}

export const initialFilterState: FilterState = {
  filters: {
    requestType: '',
    months: [],
    states:[]
  },
  generalFilters: {
    startDate: '',
    endDate: '',
  },
  filtersBatu: {
    months: []
  },
  filtersSolarCoverage: {
    brand: '',
    clientName: '',
    months: [],
    requestType: 0
  }
};

export interface NotificationServiceData {
  userId: string;
  descripcion: string|undefined;
  notificationTypeId: number|undefined;
  notificationStatusId: number;
}

export interface EditNotificationStatus {
  externalId: string;
  status: string;
}

export interface SnackData{
  type:"COMPLETE"|"FAILED",
  title:string,
  subtitle:string
}

export interface NotificationMessages{
  completedTitle:string,
  completedContent:string,
  errorTitle:string,
  errorContent:string,
  notificationId:string
}