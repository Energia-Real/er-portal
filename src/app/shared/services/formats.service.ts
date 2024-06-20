import { Injectable } from '@angular/core';
import moment from 'moment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatsService {

  dateFormat(content?: string) {
    if (content) return moment(content).format('D MMM YYYY')
     else return '-'
  }

  energyFormat(content: number): string {
    if (content) {
      return content.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    } else return ''
  }

  graphFormat(content: number): number {
    return parseFloat(content.toFixed(2));
  }
  
}
