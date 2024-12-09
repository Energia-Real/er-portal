import{Notification}from '@app/shared/models/general-models';
import { createAction, props } from '@ngrx/store';

export const updateNotifications = createAction(
  '[Notifications] Update Notifications',
  props<{ notifications:Notification[] }>()
);