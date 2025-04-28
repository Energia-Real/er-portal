import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormatInput',
    standalone: false
})
export class NumberFormatInputPipe implements PipeTransform {
  transform(value: number | string): string {
    let numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(numberValue) 
      ? numberValue.toLocaleString('en-US')
      : '';
  }
}
