# Contexto Activo

## 🔄 Enfoque de Trabajo Actual
El desarrollo actual está centrado en la implementación del **módulo de facturación** y el **dashboard principal**, que son las funcionalidades de mayor prioridad según el brief del proyecto. Estamos en fase de desarrollo frontend con integración a APIs de datos.

## 🛠️ Cambios Recientes
| **Fecha** | **Componente** | **Cambio** | **Impacto** |
|-----------|---------------|------------|-------------|
| 25/04/2025 | Dashboard Home | Implementación de gráficos comparativos CFE vs ER | Visualización de ahorros |
| 22/04/2025 | Current Billing | Integración con API de NetSuite | Datos reales de facturación |
| 20/04/2025 | Arquitectura | Configuración de NgRx Store | Base para gestión de estado |
| 18/04/2025 | UI Components | Implementación de tablas con filtros | Mejora UX en listados |

## 📋 Próximos Pasos
1. **Corto Plazo (Sprint Actual)**
   - Completar la integración de filtros globales que afecten a todos los módulos
   - Implementar la visualización detallada de facturas en panel lateral
   - Optimizar rendimiento de carga de gráficos con datasets grandes

2. **Mediano Plazo (Próximos 2 Sprints)**
   - Desarrollar el módulo completo de Site Details con sus tres subpestañas
   - Implementar el mapa interactivo con datos georreferenciados
   - Integrar sistema de notificaciones para facturas nuevas

3. **Largo Plazo (Backlog Priorizado)**
   - Módulo de reportes personalizados exportables
   - Dashboard comparativo entre múltiples sitios
   - Implementación de predicciones de ahorro basadas en tendencias

## 🧠 Decisiones Activas
| **Decisión** | **Contexto** | **Estado** | **Impacto** |
|--------------|--------------|------------|-------------|
| Usar Chart.js vs D3.js | Visualizaciones complejas | Decidido: Chart.js | Desarrollo más rápido, menos personalización |
| Estrategia de caché | Optimización de rendimiento | En evaluación | Potencial mejora de velocidad vs complejidad |
| Implementación de filtros | UX de búsqueda avanzada | En desarrollo | Afecta a todos los módulos de datos |

## 💡 Patrones y Preferencias
1. **Estructura de Componentes**
   - Componentes presentacionales (dumb) vs contenedores (smart)
   - Uso de directivas para lógica reutilizable de UI
   - Servicios singleton para lógica de negocio compartida

2. **Gestión de Estado**
   - Acciones NgRx tipadas estrictamente
   - Selectores memoizados para consultas complejas
   - Effects para operaciones asíncronas y side-effects

3. **Estilos y UX**
   - Paleta de colores corporativa con variables SCSS
   - Componentes responsivos con breakpoints estándar
   - Feedback visual inmediato en interacciones de usuario

## 🔍 Aprendizajes del Proyecto
- La integración con NetSuite requiere manejo especial de paginación y rate limiting
- Los gráficos con datasets grandes necesitan estrategias de optimización (agregación, muestreo)
- Los filtros globales deben persistir entre navegaciones para mejorar UX

## 🚧 Obstáculos Actuales
| **Obstáculo** | **Impacto** | **Estrategia de Mitigación** |
|---------------|-------------|------------------------------|
| Inconsistencia en datos de NetSuite | Valores incorrectos en facturas | Implementar validación y normalización |
| Rendimiento en carga de mapas | Experiencia lenta en conexiones débiles | Implementar lazy loading y optimización |
| Complejidad en cálculos de ahorro | Potenciales imprecisiones | Documentar fórmulas y validar con equipo financiero |
