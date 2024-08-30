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

