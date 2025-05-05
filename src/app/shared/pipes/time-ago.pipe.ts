import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo',
    standalone: false
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return 'Unknown time';
    }

    const now = new Date();
    const date = new Date(value);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); 

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800;
    const secondsInMonth = 2592000; 

    if (diff < secondsInMinute) {
      return 'Few seconds ago';
    } else if (diff < secondsInHour) {
      const minutes = Math.floor(diff / secondsInMinute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < secondsInDay) {
      const hours = Math.floor(diff / secondsInHour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < secondsInWeek) {
      const days = Math.floor(diff / secondsInDay);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diff < secondsInMonth) {
      const weeks = Math.floor(diff / secondsInWeek);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diff / secondsInMonth);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }
}
