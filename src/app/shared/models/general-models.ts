export type IForm<T> = {
  [K in keyof T]?: any;
}

export interface DrawerGeneral {
  drawerOpen: boolean;
  drawerAction: "Create" | "Edit" | "View";
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

export interface UserAuth {
  success: true;
  response: {
    userId: string;
    token: string;
    accessTo: string;
  };
}

export interface UserInfo {
  id: string,
  email: string,
  persona: {
    id: string,
    nombres: string,
    apellidos: string
  },
  pendoIntegration:{
    clientID: string,
    clientName: string
  }
  clientes: string[],
  accessTo: string
}

export interface GeneralFilters {
  clientId?: number | string
  startDate: string;
  endDate: string;
  year: string;
}

export interface DataResponseArraysMapper {
  primaryElements: any[]
  additionalItems: any[]
}

export interface ConfirmationConfig {
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


export interface notificationData {
  type: string,
  typeId?: number | undefined,
  title?: string,
  subtitle?: string,
  content?: string,
  warn?: string,
  errors?: string,
  buttonAction?: string
}

export const initialFilterState: GeneralFilters = {
  startDate: '',
  endDate: '',
  year: '',
  clientId: '',
};

export interface NotificationServiceData {
  userId: string;
  descripcion: string | undefined;
  notificationTypeId: number | undefined;
  notificationStatusId: number;
}

export interface EditNotificationStatus {
  externalId: string;
  status?: string;
  centerTextId?: number;
  readed?: boolean;
}

export interface SnackData {
  type: "COMPLETE" | "FAILED",
  title: string,
  subtitle: string
}

export interface NotificationMessages {
  completedTitleSnack?: string,
  completedContentSnack?: string,
  errorTitleSnack?: string,
  errorContentSnack?: string,
  notificationId?: string,
  successCenterMessage?: string,
  errorCenterMessage?: string,
  userId?: string
}

export interface Notification {
  description: string,
  userId: string,
  notificationTypeId: number,
  notificationStatusId: number,
  date: Date,
  externalId: string,
  notificationCenterTextId: number,
  readed: boolean
}

export interface GeneralResponse<T> {
  success: boolean,
  response: T,
  errors: {
    errors: ErrorRequest[]
  }
}

export interface GeneralPaginatedResponse<T> {
  pageSize: number,
  page: number,
  totalItems: number,
  data: [T]
  errors: {
    errors: ErrorRequest[]
  }
}

export interface ApiResponse<T> {
  success: boolean;
  response: T;
  errors?: any[];
}

export interface NotificationsResponse {
  notificationsResponse: Notification[];
}

export interface ErrorRequest {
  tipo: string;
  field: string;
  descripcion: string;
  warn?: string;
  title?: string;
}

export interface MonthsFilters {
  name: string;
  value: string;
}
