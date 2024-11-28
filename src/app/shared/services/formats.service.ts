import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormatsService {

  dateFormat(content?: string) {
    if (content) return moment(content).format('D MMM YYYY')
     else return ''
  }

  energyFormat(content: string | number): string {
    let numberValue = typeof content === 'string' ? parseFloat(content.replace(/,/g, '')) : content;
    if (!isNaN(numberValue)) {
      return numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } else return '';
  }
 
  energyWithDecimals(content: string | number): string {
    let numberValue = typeof content === 'string' ? parseFloat(content.replace(/,/g, '')) : content;
    if (!isNaN(numberValue)) {
      return numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else return '';
  }
    
  homeGraphFormat(content:string):number{
    let cleanString = content.replace(/,/g, '');
    return +cleanString;
  }

  graphFormat(content: number): number {
    return parseFloat(content.toFixed(2));
  }

  moneyFormat(amount: number) {
    if (!amount) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' MXN';
  }

  getMonthName(month: number)  : string{
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return months[month - 1];
  }

  formatContractDuration(duration: { years: number; months: number; days: number }): string {
    const { years, months, days } = duration;
  
    const yearText = years ? `${years} año(s)` : '';
    const monthText = months ? `${months} mes(es)` : '';
    const dayText = days ? `${days} día(s)` : '';
  
    return [yearText, monthText, dayText].filter(Boolean).join(' ');
  }
}
