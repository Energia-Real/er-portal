# Stack Tecnológico - Frontend

## 📜 Dependencias Clave
| **Tipo**            | **Librería**               | **Versión** | **Uso Crítico**               |
|----------------------|----------------------------|-------------|-------------------------------|
| Framework           | Angular Core               | 17.2.0      | Routing, DI, Change Detection |
| UI Components       | Angular Material           | 17.3.0      | Formularios, Modales          |
| Gráficos            | Chart.js                   | 3.9.1       | Todos los visualizadores      |
| Mapas               | Google Maps JS API         | 1.16.8      | Mapas interactivos            |
| Utilerías           | CryptoJS                   | 3.3.0       | Cifrado client-side           |

## 🛠️ Configuraciones Especiales
**Chart.js (src/environments/chart-config.ts):**
```typescript
export const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
};


🚨 Postura de Seguridad
Diagram
flowchart LR
    A[User Input] --> B{{Sanitización Angular}}
    B --> C[CryptoJS Encryption]
    C --> D[API Call]
    D --> E{{HTTPS Only}}

    🚦 Health Check
Área	Estado	Acciones
Dependencias	92% actualizadas	Actualizar apexcharts
Vulnerabilidades	1 baja (crypto-js)	Monitorear actualizaciones
Performance	Lighthouse 89/100	Optimizar imágenes lazy-load


🚨 Alertas Técnicas
Chart.js 3.9.1:

No compatible con IE11

Requiere polyfills para Safari < 14

Angular Material 17.3:

Verificar breaking changes en typography

CryptoJS 3.3.0:

Vulnerabilidad CBC mode (mitigada)