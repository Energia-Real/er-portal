import { NotificationsState } from '../reducers/notifications.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectNotifications = createSelector(
  selectNotificationsState,
  (state: NotificationsState) => state.notifications
);

export const selectTopUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => {
    return notifications
      .filter(notification => !notification.readed) 
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6); 
  }
);

export const selectAllNotificationsOrdered = createSelector(
  selectNotifications, 
  (notifications) => {
    return [...notifications] 
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
);
