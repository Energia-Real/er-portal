# Contexto del Producto

## 🔍 Propósito del Proyecto
El Portal de Clientes de Energía Real es una plataforma web diseñada para empoderar a los clientes con visibilidad completa sobre su consumo energético, producción solar, facturación y ahorros. Este portal responde a la necesidad crítica de transparencia y autogestión en la relación cliente-proveedor de energía renovable.

## 🎯 Problemas que Resuelve

| **Problema** | **Solución** | **Impacto** |
|--------------|--------------|-------------|
| Falta de visibilidad sobre facturación | Dashboard de facturas con búsqueda y filtros | Reducción del 80% en consultas al equipo de soporte |
| Desconocimiento del rendimiento de plantas solares | Métricas detalladas por sitio y visualizaciones | Mejor toma de decisiones basada en datos |
| Procesos manuales para obtener facturas | Descarga directa de PDF/XML | Autonomía del cliente y reducción de carga operativa |
| Dificultad para comparar ahorro vs. CFE | Gráficos comparativos y KPIs de ahorro | Demostración tangible del valor del servicio |
| Falta de contexto sobre impacto ambiental | Métricas de CO₂ y equivalentes visuales | Refuerzo del valor sostenible de la inversión |

## 👤 Experiencia de Usuario

### Perfiles de Usuario
1. **Director Financiero**
   - Necesita: Visión global de costos y ahorros
   - Comportamiento: Visitas mensuales para revisión de KPIs financieros
   - Valor: Justificación de inversión en energía renovable

2. **Gerente de Sustentabilidad**
   - Necesita: Métricas de impacto ambiental
   - Comportamiento: Generación de reportes trimestrales
   - Valor: Datos para reportes ESG y comunicación corporativa

3. **Contador/Administrador**
   - Necesita: Acceso rápido a facturas y datos fiscales
   - Comportamiento: Uso frecuente del módulo de facturación
   - Valor: Eficiencia en procesos contables mensuales

### Flujos de Usuario Críticos
1. **Consulta de Facturación Actual**
   - Ingreso → Filtrado por periodo → Visualización de facturas → Descarga de documentos

2. **Análisis de Rendimiento por Sitio**
   - Ingreso → Selección de sitio → Revisión de métricas → Comparación con periodos anteriores

3. **Verificación de Ahorros Globales**
   - Ingreso → Dashboard principal → Análisis de KPIs → Exploración de gráficos comparativos

## 🎨 Principios de Diseño

1. **Transparencia Total**
   - Toda métrica debe ser explicable y trazable
   - Tooltips informativos en cada visualización

2. **Autonomía del Cliente**
   - Minimizar la necesidad de contacto con soporte
   - Proporcionar herramientas de autoservicio completas

3. **Visualización Contextual**
   - Presentar datos con referencias comparativas (vs. mes anterior, vs. CFE)
   - Usar metáforas visuales para métricas abstractas (ej. CO₂ = árboles salvados)

4. **Accesibilidad Informativa**
   - Estructura de información en capas (resumen → detalle)
   - Consistencia en la presentación de datos entre secciones

## 🔄 Integración con Sistemas Existentes

| **Sistema** | **Tipo de Integración** | **Datos Intercambiados** |
|-------------|-------------------------|--------------------------|
| NetSuite | API REST | Facturas, contratos, datos fiscales |
| Datawarehouse Arkham | API REST | Datos de producción energética |
| Google Maps | API JavaScript | Geolocalización de plantas |

## 📈 Métricas de Éxito del Producto

1. **Adopción**
   - 70% de clientes usando el portal mensualmente
   - 90% de facturas consultadas vía portal vs. soporte

2. **Satisfacción**
   - NPS > 50 en encuestas post-uso
   - Tiempo promedio en plataforma > 5 minutos

3. **Eficiencia Operativa**
   - Reducción del 90% en tickets relacionados con facturación
   - Disminución del 80% en consultas al equipo de Customer Success
