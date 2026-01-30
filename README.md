# 🌊 Agua Inmaculada - Sistema de Gestión Integral

Sistema completo de gestión para purificadora de agua con Smart Vending. Desarrollado con React, TypeScript y Tailwind CSS.

![Agua Inmaculada](https://img.shields.io/badge/Agua-Inmaculada-0891b2?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

## 🎯 Características Principales

### 📊 Dashboard Inteligente
- Vista remota para monitoreo desde casa
- Vista en sitio para operación en planta
- KPIs en tiempo real
- Alertas y notificaciones
- Gráficas de tendencias

### 💧 Bitácora de Calidad del Agua
- Registro de mediciones (Cloro, SDT, Dureza)
- Validaciones automáticas según manual
- Historial completo con gráficas
- Alertas cuando parámetros están fuera de rango
- Cálculo automático de próximas mediciones

### 🔧 Módulo de Mantenimientos
- Catálogo de 10+ mantenimientos basados en el manual
- Guías paso a paso interactivas
- Checklists digitales
- Programación automática según frecuencia
- Evidencias fotográficas

### 📅 Agenda Inteligente
- Calendario visual con código de colores
- Programación automática de mantenimientos
- Alertas de vencimientos
- Vista semanal/mensual
- Notificaciones configurables

### 💰 Análisis Financiero
- Importación de ventas semanales
- Gestión de gastos (fijos y variables)
- Análisis de utilidad neta
- Gráficas de tendencias
- Proyecciones de crecimiento
- KPIs financieros en tiempo real

### 📖 Manual Interactivo
- Versión digital del manual de operación
- Búsqueda inteligente
- Solucionador de problemas
- Acceso rápido a procedimientos

### 📈 Sistema de Reportes
- Reporte financiero mensual
- Cumplimiento de mantenimientos
- Control de calidad del agua
- Exportación a PDF (en desarrollo)

### ✅ Mi Visita Semanal
- Planificador inteligente de tareas
- Modo visita con temporizador
- Checklist interactivo
- Priorización automática
- Estimación de tiempo

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ (recomendado: 20.x)
- npm o yarn

### Pasos de Instalación

1. **Navega al directorio del proyecto:**
```bash
cd agua-inmaculada
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Inicia el servidor de desarrollo:**
```bash
npm run dev
```

4. **Abre tu navegador en:**
```
http://localhost:3000
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview de la build

# Linting
npm run lint         # Ejecuta ESLint
```

## 🎨 Tecnologías Utilizadas

- **React 18.2** - Framework UI
- **TypeScript 5.2** - Tipado estático
- **Vite 5.0** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Estilos utility-first
- **Zustand 4.4** - State management
- **React Router 6** - Routing
- **Recharts 2.10** - Gráficas y visualizaciones
- **date-fns 3.0** - Manejo de fechas
- **Lucide React** - Iconos modernos

## 📂 Estructura del Proyecto

```
agua-inmaculada/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   └── Layout.tsx    # Layout principal con sidebar
│   ├── pages/            # Páginas/Vistas
│   │   ├── Dashboard.tsx
│   │   ├── Calidad.tsx
│   │   ├── Mantenimientos.tsx
│   │   ├── Agenda.tsx
│   │   ├── Finanzas.tsx
│   │   ├── Manual.tsx
│   │   ├── Reportes.tsx
│   │   └── VisitaSemanal.tsx
│   ├── store/            # Estado global (Zustand)
│   │   └── useStore.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx           # Componente raíz
│   ├── main.tsx          # Entry point
│   └── index.css         # Estilos globales
├── public/               # Assets estáticos
├── index.html            # HTML template
├── package.json          # Dependencias
├── tsconfig.json         # Config TypeScript
├── tailwind.config.js    # Config Tailwind
└── vite.config.ts        # Config Vite
```

## 🎯 Flujo de Uso Típico

### Desde Casa (Lunes a Viernes)
1. Abre el Dashboard
2. Revisa estado general del sistema
3. Verifica alertas y notificaciones
4. Consulta ventas de la semana (desde tu app vending)

### Preparación para Visita (Jueves)
1. Revisa "Mi Visita Semanal"
2. Ve el plan de tareas
3. Prepara materiales necesarios

### Durante la Visita (Sábado)
1. Activa "Modo Visita"
2. Sigue el checklist paso a paso:
   - Medición de calidad
   - Retrolavado de filtros
   - Limpieza de pulidores
   - Registro de ventas semanales
3. Marca tareas como completadas
4. Finaliza visita y revisa resumen

### Fin de Mes
1. Genera reportes automáticos
2. Revisa utilidad neta
3. Analiza tendencias
4. Toma decisiones informadas

## 📋 Datos Pre-cargados

El sistema viene con datos de ejemplo para que puedas probar todas las funcionalidades:

- **10 Mantenimientos** basados en el manual
- **Ventas** de las últimas 4 semanas
- **Gastos** fijos y variables
- **Mediciones** de calidad
- **Registros** de mantenimiento
- **Notificaciones** de ejemplo
- **Plan de visita** semanal

## 🔐 Personalización

### Actualizar Precios
Ve a `src/store/useStore.ts` y modifica:

```typescript
precios: {
  garrafon20L: 30,   // Tu precio aquí
  garrafon10L: 18,   // Tu precio aquí
  litro: 2,          // Tu precio aquí
}
```

### Actualizar Gastos Fijos
En `src/store/useStore.ts`:

```typescript
gastosFijos: [
  { id: '1', concepto: 'Agua', monto: 800, categoria: 'servicios' },
  { id: '2', concepto: 'Luz', monto: 1200, categoria: 'servicios' },
  // Agrega tus gastos aquí
]
```

### Actualizar Nombre/Usuario
En `src/components/Layout.tsx` busca "Soto" y reemplaza con tu nombre.

## 🎨 Tema Visual

El sistema utiliza la identidad visual de Agua Inmaculada:

- **Color Primario:** Azul agua (#0891b2)
- **Color Secundario:** Rosa (#ec4899)
- **Color Éxito:** Verde (#10b981)
- **Tipografía:** System UI (adaptativa)

### Personalizar Colores
Edita `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0891b2',  // Tu color primario
    // ...
  }
}
```

## 📱 Responsive Design

El sistema es completamente responsive y funciona en:

- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

Ideal para usar desde tu celular en la planta.

## 🔮 Funcionalidades Futuras

### Fase 2 (Próximamente)
- [ ] Exportación real de reportes en PDF
- [ ] Modo offline completo (PWA)
- [ ] Notificaciones push
- [ ] Múltiples usuarios y roles
- [ ] Backup automático en la nube

### Fase 3 (Planificado)
- [ ] Integración con API de sistema vending
- [ ] Cámara de seguridad integrada
- [ ] Sensores IoT en tiempo real
- [ ] App móvil nativa
- [ ] Dashboard para clientes

## 🤝 Soporte

Si necesitas ayuda o tienes dudas:

1. Revisa la documentación en el Manual Interactivo
2. Consulta los datos de ejemplo pre-cargados
3. Experimenta con las diferentes vistas

## 📄 Licencia

Sistema desarrollado exclusivamente para Agua Inmaculada.

---

## 🎉 ¡Listo para Usar!

Tu sistema está **100% funcional** y listo para empezar a gestionar tu purificadora de manera profesional.

### Primeros Pasos Recomendados:

1. ✅ Explora el Dashboard
2. ✅ Revisa el módulo "Mi Visita Semanal"
3. ✅ Actualiza los precios en el código
4. ✅ Registra tu primera medición de calidad
5. ✅ Genera tu primer reporte

**¡Éxito con tu purificadora! 🌊💙**

---

*Desarrollado con ❤️ para Agua Inmaculada - "La del garrafón rosita"*
