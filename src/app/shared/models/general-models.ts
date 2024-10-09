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
    states: string[];
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

export const initialFilterState: FilterState = {
  filters: {
    requestType: '',
    months: [],
    states:[]
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
