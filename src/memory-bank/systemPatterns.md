# Patrones del Sistema - Frontend

## 🏗️ Arquitectura Frontend
**Componentes Principales:**
- **UI Core**: Angular 17 + Material 
- **State Management**: NgRx (Store + Effects + DevTools)
- **Visualizaciones**: Chart.js  + Google Maps
- **Utilidades**: CryptoJS (cifrado), Moment.js (fechas), Tippy.js (tooltips)

## 🔄 Patrones Clave
| **Patrón**         | **Implementación**          | **Beneficio**                          |
|--------------------|-----------------------------|----------------------------------------|
| Singleton        | Servicios `@Injectable()`    | `DataService`                   |
| State Container   | NgRx Store                 | Estado global predecible               |
| Observer          | RxJS en servicios          | Manejo reactivo de eventos             |
| Strategy Pattern  | Chart.js vs Observable(proximamente)     | Intercambio flexible de librerías      |
| Strategy         | Wrapper Chart.js             | `DynamicChartDirective`         |


## ⚙️ Decisiones Técnicas
| **Decisión**           | **Alternativas**   | **Razón**                              |
|------------------------|--------------------|----------------------------------------|
| Chart.js + Observable  | Solo Chart.js      | Observable para gráficos complejos     |
| NgRx                   | Servicios simples  | Manejo de estado complejo              |
| Angular Material       | Tailwind puro      | Acelerar desarrollo UI                 |

## 🛡️ Seguridad
- **Cifrado cliente**: CryptoJS para datos sensibles
- **XSS**: Sanitización automática de Angular
- **CSP**: Política de seguridad de contenido habilitada

## ⚠️ Limitaciones Conocidas
- Chart.js no soporta zoom nativo (usar `ngx-image-zoom` como alternativa)
- Problemas de memoria con múltiples instancias (solución: `destroy()` manual)

⚙️ Optimización Rendimiento
Lazy Loading: Módulos Angular

Caching: @ngrx/store-devtools para time-travel debugging

Tree-shaking: Configuración específica en angular.json