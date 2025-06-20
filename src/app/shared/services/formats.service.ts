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

  dateFormatWithoutDay(content?: string) {
    if (content) return moment(content, 'D/M/YYYY').format('MMM YYYY');
    else return '';
  }

  energyFormat(content: string | number): string {
    if (!content) return ''

    let numberValue = typeof content === 'string' ? parseFloat(content.replace(/,/g, '')) : content;
    if (!isNaN(numberValue)) {
      return numberValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else return '';
  }

  energyFormatGWh(content: string | number): string {
    if (!content) return ''

    let numberValue = typeof content === 'string' ? parseFloat(content.replace(/,/g, '')) : content;
    if (!isNaN(numberValue)) {
      const gwhValue = numberValue / 1_000_000;

      return gwhValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' GWh';
    } else return '';
  }

  energyFormatMWh(content: string | number): string {
    if (!content) return '';

    let numberValue = typeof content === 'string' ? parseFloat(content.replace(/,/g, '')) : content;
    if (!isNaN(numberValue)) {
      const mwhValue = numberValue / 1_000;

      return mwhValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' MWh';
    } else return '';
  }


  energyWithDecimalsOrKWH(content: string | number, formattedKwh?: boolean): string {
    let numberValue = typeof content == 'string' ? parseFloat(content.replace(/,/g, '')) : content;

    if (!numberValue) return '';

    if (!isNaN(numberValue)) {
      const formattedValue = numberValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      return formattedKwh ? `${formattedValue} kWh` : formattedValue;
    } else return '';
  }

  energyWithoutDecimalsOrKWH(content: string | number, formattedKwh?: boolean): string {
    let numberValue = typeof content === 'string'
      ? parseFloat(content.replace(/,/g, ''))
      : content;

    if (!numberValue) return '';

    if (!isNaN(numberValue)) {
      const truncatedValue = Math.trunc(numberValue);

      const formattedValue = truncatedValue.toLocaleString('es-MX', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });

      return formattedKwh ? `${formattedValue} kWh` : formattedValue;
    } else {
      return '';
    }
  }


  homeGraphFormat(content: string): number {
    let cleanString = content.replace(/,/g, '');
    return +cleanString;
  }

  graphFormat(content: number): number {
    return parseFloat(content.toFixed(2));
  }

  savingsGraphFormat(number: string): number {
    try {
      const sanitizedNumber = number.replace(/,/g, '');
      const numValue = Number(sanitizedNumber);

      if (!isNaN(numValue)) {
        return numValue;
      } else {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  }

  moneyFormat(amount: number) {
    if (!amount) return '0 MXN'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' MXN';
  }

  getMonthName(month: number): string {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return months[month - 1];
  }

  formatContractDuration(duration: number): string {
   // const { years, months, days } = duration;

    const yearText = duration ? `${duration} year(s)` : '';
    //const monthText = months ? `${months} month(s)` : '';
    //const dayText = days ? `${days} day(s)` : '';

    return yearText;
  }
}
