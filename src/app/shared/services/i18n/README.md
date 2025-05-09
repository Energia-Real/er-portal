# Configuración de ngx-translate

Este documento explica cómo utilizar ngx-translate en el proyecto.

## Estructura

- **TranslationService**: Servicio que encapsula la funcionalidad de ngx-translate y proporciona métodos adicionales.
- **Archivos de traducción**: Archivos JSON ubicados en `src/assets/i18n/` con las traducciones para cada idioma.
- **Componentes de ejemplo**: 
  - `LanguageSwitcherComponent`: Permite cambiar entre idiomas.
  - `TranslationExampleComponent`: Muestra ejemplos de uso de ngx-translate.

## Uso básico

### 1. Importar TranslateModule en tu módulo

El `TranslateModule` ya está configurado en el `AppModule` y exportado desde el `SharedComponensModule`. Si estás creando un componente standalone, debes importarlo directamente:

```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  // ...
  standalone: true,
  imports: [TranslateModule, CommonModule]
})
export class MiComponente { }
```

### 2. Usar traducciones en plantillas

Hay varias formas de usar las traducciones en tus plantillas:

#### Usando la pipe translate

```html
<p>{{ 'CLAVE.SUBCLAVE' | translate }}</p>
```

#### Usando la directiva translate

```html
<p translate>CLAVE.SUBCLAVE</p>
```

#### Con parámetros

```html
<p>{{ 'MENSAJE.BIENVENIDA' | translate:{ nombre: nombreUsuario } }}</p>
```

### 3. Usar traducciones en código TypeScript

Puedes inyectar el `TranslationService` en tu componente:

```typescript
constructor(private translationService: TranslationService) { }

// Obtener una traducción de forma instantánea
const mensaje = this.translationService.instant('CLAVE.SUBCLAVE');

// Obtener una traducción de forma reactiva (devuelve un Observable)
this.translationService.getTranslation('CLAVE.SUBCLAVE').subscribe(traduccion => {
  console.log(traduccion);
});
```

### 4. Cambiar el idioma

Puedes cambiar el idioma en cualquier momento usando el `TranslationService`:

```typescript
this.translationService.setLanguage('en-US'); // Cambiar a inglés (Estados Unidos)
this.translationService.setLanguage('es-MX'); // Cambiar a español (México)
```

También puedes usar el componente `LanguageSwitcherComponent` para permitir al usuario cambiar el idioma:

```html
<app-language-switcher></app-language-switcher>
```

## Añadir nuevas traducciones

Para añadir nuevas traducciones, edita los archivos JSON en `src/assets/i18n/`:

### Ejemplo de estructura de traducción

```json
{
  "GENERAL": {
    "TITULO": "Mi Aplicación",
    "BOTON": {
      "GUARDAR": "Guardar",
      "CANCELAR": "Cancelar"
    }
  },
  "PAGINA": {
    "BIENVENIDA": "Bienvenido, {{nombre}}!"
  }
}
```

## Añadir un nuevo idioma

1. Crea un nuevo archivo JSON en `src/assets/i18n/` con el código del idioma (por ejemplo, `fr-FR.json` para francés de Francia).
2. Añade el idioma a la lista de idiomas soportados en `AppComponent`:

```typescript
translationService.initialize('es-MX', ['es-MX', 'en-US', 'fr-FR']);
```

3. Actualiza el componente `LanguageSwitcherComponent` para incluir el nuevo idioma.

## Buenas prácticas

1. Usa una estructura jerárquica para las claves de traducción (por ejemplo, `MODULO.COMPONENTE.CLAVE`).
2. Mantén las traducciones organizadas por módulos o características.
3. Usa el `TranslationService` en lugar de inyectar directamente el `TranslateService` de ngx-translate.
4. Considera usar constantes para las claves de traducción para evitar errores tipográficos.
