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
      return content.toString()
    } else return '0'
  }

  homeGraphFormat(content:string):number{
    let cleanString = content.replace(/,/g, '');
    // Convertir el string limpio a número
    return +cleanString;
  }

  graphFormat(content: number): number {
    return parseFloat(content.toFixed(2));
  }
  
}
