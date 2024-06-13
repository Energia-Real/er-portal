import { Injectable } from '@angular/core';
import moment from 'moment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatsService {

  dateFormat(content: string) {
    return moment(content).format('D MMM YYYY')
  }

  energyFormat(content: number) :string {
    if (content) {
      return content.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    } else return ''
  }

  graphFormat(content: number) {
    return parseInt(content.toString(), 10)
  }

}
