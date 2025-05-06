import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthAbbr',
  standalone : false
})
export class MonthAbbreviationPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const abbreviations = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    const abbreviationsEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Si es un número (1-12)
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const monthIndex = (Number(value) - 1) % 12;
      return abbreviationsEn[monthIndex]; // Por defecto en inglés
    }
    
    // Si es un string con el nombre del mes
    const valueStr = String(value).toLowerCase();
    
    // Buscar en meses en español
    const spanishIndex = months.findIndex(month => 
      month.toLowerCase() === valueStr || 
      month.toLowerCase().startsWith(valueStr)
    );
    
    if (spanishIndex !== -1) {
      return abbreviations[spanishIndex];
    }
    
    // Buscar en meses en inglés
    const englishIndex = monthsEn.findIndex(month => 
      month.toLowerCase() === valueStr || 
      month.toLowerCase().startsWith(valueStr)
    );
    
    if (englishIndex !== -1) {
      return abbreviationsEn[englishIndex];
    }
    
    return '';
  }
}
