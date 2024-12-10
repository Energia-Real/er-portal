import { createReducer, on } from '@ngrx/store';
import { updateNotifications } from '../actions/notifications.actions';
import{Notification}from '@app/shared/models/general-models';

export interface NotificationsState {
  notifications:Notification[] 
}

export const initialState: NotificationsState = {
    notifications:[]
};

export const notificationsReducer = createReducer(
  initialState,
  on(updateNotifications, (state, { notifications}) => ({
    notifications  }))
);
