# Portal de Clientes – Brief de Proyecto

## 🎯 Objetivos Principales
- Incrementar la visibilidad y autonomía del cliente en la gestión de facturas (self-service)
- Proveer un dashboard global y por sitio con métricas de generación, consumo y ahorros
- Integrar en tiempo real datos de facturación y contratos desde NetSuite
- Reducir en un 80 % las consultas al equipo de Customer Success y Finanzas relacionadas con la energía producida y facturación

## 🔑 Requisitos Clave

### Funcionales (Prioridad)
- **Current Billing:** Lista de facturas actuales con columnas (Razón social, Año, Mes, Estatus, Producto, Monto, Acciones: 🔍, 📄, 📑) (Alta)
- **Buscador en tablas:** Filtrado incremental por número de factura, cliente o mes en Current Billing y Billing History (Media)
- **Invoice details:** Panel lateral con datos fiscales, periodo, estado, desglose por sitio y descarga PDF/XML (Media)

- **Home Dashboard:**
  - Tarjetas KPI: consumo total, producción total, costo CFE sin solar, ahorro total, % cobertura solar, % ahorro vs. CFE, ahorro CO₂ y equivalentes visuales (Alta)
  - Gráfico combinado: CFE subtotal, Energía Real subtotal, ahorro económico y gastos sin ER (Media)
  - Mapa interactivo por estado con tooltip de plantas activas, MWp y ahorro CO₂ (Media)
  - Gráfico comparativo por sitio: producción vs. consumo (Media)
  - Tabla paginada de sitios con columnas (sitio, producción, consumo, % rendimiento, cobertura solar, % ahorro, tCO₂, estado) y filtros (fecha, buscador) (Media)

- **Site Details:** Para cada planta, tres subpestañas: Overview, Site performance, Savings (Alta)
  - **Overview:** timestamp de conexión, tamaño de sistema, paneles, ER rate, duración PPA, RPU, edad, fecha COD/commission, mapa georreferenciado (Alta)
  - **Site performance:** generación total, consumo CFE, exportación, variación vs. mes previo, cobertura solar, rendimiento, gráfico mensual comparativo con tooltip (Media)
  - **Savings:** tarjetas de subtotal CFE, subtotal ER, ER+CFE, gasto sin ER, ahorro total; gráfico de barras y línea mensual (Media)

- **Billing History:** Historial paginado con iconos de acción y búsqueda en tabla (Media)
- **Filters globales:** Año, Cliente, Razón social, Sitio y Producto que afectan todos los módulos de Billing Details (Alta)
- **Invoice Information:** Tabla de datos fiscales (RPU, RFC, dirección) y opción “Solicitar edición” vía Typeform (Media)

### No Funcionales
- **Performance:** Carga de páginas y gráficos < 2 s para hasta 1 000 filas; dashboard < 2 s con 100 sitios
- **Seguridad:** OAuth 2.0, TLS 1.2+, cifrado en reposo, cumplimiento LOPD/GDPR, logs de auditoría
- **Escalabilidad:** Soporte a 1 000 usuarios concurrentes sin degradación

## 📊 Métricas de Éxito
- Tiempo de carga de sección < 2 s
- ≥ 80 % de facturas consultadas vía portal vs. soporte
- ≥ 70 % de clientes usan el Home Dashboard mensualmente
- ≥ 80 % de visitas a detalle de sitio generan una acción (descarga, filtro, exportación)
- Satisfacción ≥ 90 % en encuesta post-uso
- 90 % de reducción en tickets de facturación

## ⚠️ Supuestos y Restricciones
- **Supuesto:** API de NetSuite disponible y con datos de facturación, contratos y RFC
- **Supuesto:** Datos de produccion de energia correctos y provenientes de Datawarehouse de Arkham
- **Restricción:** Despliegue antes de fin de Q3 2025
