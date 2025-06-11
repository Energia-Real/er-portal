import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('');
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translateService: TranslateService) {
    // Inicializar el subject con el idioma actual
    this.currentLangSubject.next(this.translateService.currentLang);
  }

  /**
   * Inicializa el servicio de traducción
   * @param defaultLang Idioma por defecto
   * @param supportedLangs Array de idiomas soportados
   */
  initialize(defaultLang: string, supportedLangs: string[]): void {
    // Configurar idiomas soportados
    this.translateService.addLangs(supportedLangs);
    
    // Establecer idioma por defecto
    this.translateService.setDefaultLang(defaultLang);
    
    // Obtener el idioma del navegador
    const browserLang = this.translateService.getBrowserLang();
    
    // Buscar un idioma compatible con el idioma del navegador
    let langToUse = defaultLang;
    if (browserLang) {
      // Buscar un idioma soportado que comience con el código del navegador
      const matchedLang = supportedLangs.find(lang => 
        lang.startsWith(browserLang) || browserLang.startsWith(lang.split('-')[0])
      );
      if (matchedLang) {
        langToUse = matchedLang;
      }
    }
    this.setLanguage(langToUse);
  }

  /**
   * Cambia el idioma actual
   * @param lang Código del idioma a establecer
   */
  setLanguage(lang: string): void {
    this.translateService.use(lang);
    this.currentLangSubject.next(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  /**
   * Obtiene el idioma actual
   * @returns Código del idioma actual
   */
  getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }

  /**
   * Obtiene los idiomas soportados
   * @returns Array de códigos de idiomas soportados
   */
  getSupportedLanguages(): string[] {
    return this.translateService.getLangs();
  }

  /**
   * Traduce una clave
   * @param key Clave a traducir
   * @param params Parámetros opcionales para la traducción
   * @returns Observable con la traducción
   */
  getTranslation(key: string, params?: object): Observable<string> {
    console.log(this.translateService.get(key, params))
    return this.translateService.get(key, params);
  }

  /**
   * Traduce una clave de forma instantánea
   * @param key Clave a traducir
   * @param params Parámetros opcionales para la traducción
   * @returns Traducción como string
   */
  instant(key: string, params?: object): string {
    return this.translateService.instant(key, params);
  }
}
