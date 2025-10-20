# Perfiles Profesionales

Una aplicación web moderna para conectar usuarios con profesionales verificados en diferentes áreas.

## 🚀 Características

- **Landing Page Responsive**: Diseño moderno y limpio que se adapta a todos los dispositivos
- **Búsqueda Inteligente**: Barra de búsqueda para encontrar profesionales por profesión, habilidad o nombre
- **Categorías de Actividades**: Cards interactivas con las actividades más frecuentes
- **Arquitectura Modular**: Componentes separados con estilos y lógica independientes
- **Servicios**: Estructura de servicios para manejo de datos

## 🛠️ Tecnologías Utilizadas

- **Angular 18+**: Framework principal
- **TypeScript**: Lenguaje de programación
- **CSS3**: Estilos modernos con diseño responsive
- **Angular Signals**: Para manejo de estado reactivo
- **Angular Routing**: Navegación entre páginas

## 📁 Estructura del Proyecto

```
src/app/
├── components/
│   ├── home/                 # Componente principal de la landing
│   ├── search-bar/           # Barra de búsqueda
│   └── activity-cards/       # Cards de actividades frecuentes
├── services/
│   └── professional.service.ts # Servicio para manejo de datos
└── app.routes.ts            # Configuración de rutas
```

## 🎨 Diseño

El diseño sigue los principios de:
- **Colores**: Esquema de colores con turquesa (#20B2AA) como color principal
- **Tipografía**: Inter como fuente principal
- **Responsive**: Adaptable a móviles, tablets y desktop
- **UX Moderna**: Interacciones suaves y diseño limpio

## 🚀 Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   ng serve
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:4200
   ```

## 📱 Responsive Design

- **Desktop**: Layout completo con grid de 6 columnas
- **Tablet**: Grid adaptativo con 2-3 columnas
- **Mobile**: Layout de una columna optimizado para touch

## 🔧 Componentes

### HomeComponent
- Hero section con título principal
- Barra de búsqueda integrada
- Sección de actividades frecuentes

### SearchBarComponent
- Input con icono de búsqueda
- Botón de búsqueda
- Funcionalidad de búsqueda por Enter

### ActivityCardsComponent
- Grid responsive de cards
- Efectos hover
- Datos dinámicos de categorías

### ProfessionalService
- Manejo de datos de profesionales
- Métodos de búsqueda y filtrado
- Datos de ejemplo incluidos

## 🎯 Próximas Funcionalidades

- [ ] Página de resultados de búsqueda
- [ ] Perfiles detallados de profesionales
- [ ] Sistema de filtros avanzados
- [ ] Integración con API real
- [ ] Sistema de autenticación
- [ ] Panel de administración

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
