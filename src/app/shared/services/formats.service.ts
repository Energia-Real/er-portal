import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatsService {

  dateFormat(content: string) {

  }

  energyFormat(content: number) :string {
    if (content) {
      return content.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    } else return ''
  }

  
  moneyFormat(content: string) {

  }
}
