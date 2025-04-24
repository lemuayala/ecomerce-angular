# Lemu! E-commerce Frontend ✨

Este proyecto es el frontend para una tienda de comercio electrónico moderna, construido con Angular (v19+) y estilizado con Tailwind CSS. Presenta una interfaz de usuario limpia, responsiva y atractiva, enfocándose en una experiencia de compra agradable.

![image](https://github.com/user-attachments/assets/86161f21-6ee0-4433-8e95-0b9e52b1504f)

## Características Principales 🚀

*   **Diseño Responsivo:** Se adapta a diferentes tamaños de pantalla (móvil, tablet, escritorio).
*   **Componentes Modernos:** Utiliza la arquitectura de Standalone Components de Angular.
*   **Navegación Fluida:**
    *   Barra de navegación fija (`sticky`) con efecto *glassmorphism* (fondo semitransparente con desenfoque).
    *   Logo con gradiente de texto.
    *   Menú móvil desplegable.
    *   Enlaces de navegación claros (Inicio, Productos).
*   **Página de Inicio Atractiva:**
    *   Sección "Hero" llamativa con gradiente.
    *   Sección de Categorías Destacadas con imágenes y enlaces.
    *   Sección "Por Qué Elegirnos" con iconos.
    *   Llamada a la Acción (CTA) clara.
*   **Lista de Productos:** Página dedicada para mostrar los productos disponibles (componente `ProductListComponent`).
*   **Estilizado con Tailwind CSS:** Utilidades CSS para un desarrollo rápido y consistente de la interfaz.
*   **Enrutamiento Básico:** Configuración inicial de rutas para las páginas principales.

## Tecnologías Utilizadas 🛠️

*   **Angular** (v19+ con Standalone Components)
*   **Tailwind CSS**
*   **TypeScript**
*   **Angular Signals** (para estado reactivo simple en componentes)
*   **Angular CLI**

## Prerrequisitos 📋

Asegúrate de tener instalado lo siguiente:

*   Node.js (se recomienda versión LTS, ej. v18 o v20)
*   npm (generalmente viene con Node.js) o Yarn
*   Angular CLI: `npm install -g @angular/cli`

## Instalación ⚙️

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    ```
    o si usas Yarn:
    ```bash
    yarn install
    ```

## Ejecutar el Servidor de Desarrollo 🏃

Ejecuta el siguiente comando para iniciar la aplicación en modo de desarrollo:

```bash
ng serve -o
```

Esto compilará la aplicación, iniciará un servidor de desarrollo y abrirá automáticamente tu navegador en `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Compilar para Producción 📦

Para crear una versión optimizada para producción, ejecuta:

```bash
ng build --configuration production
```

Los archivos compilados se encontrarán en el directorio `dist/<nombre-del-proyecto>/browser/`. Estos son los archivos que desplegarías en tu servidor web.

## Estructura del Proyecto (Simplificada) 📁

```text
src/
├── app/
│   ├── core/
│   │   └── components/
│   │       └── navbar/       # Componente de la barra de navegación
│   ├── features/
│   │   └── home/
│   │       └── pages/
│   │           └── home/     # Componente de la página de inicio
│   ├── modules/              # (Asumiendo estructura modular)
│   │   └── products/
│   │       └── components/
│   │           └── product-list/ # Componente de lista de productos
│   ├── app.component.*       # Componente raíz de la aplicación
│   ├── app.config.ts         # Configuración principal (standalone)
│   └── app.routes.ts         # Definición de rutas
├── assets/                   # Archivos estáticos (imágenes, fuentes, etc.)
├── environments/             # Configuración de entornos
├── main.ts                   # Punto de entrada principal
├── styles.css                # Estilos globales (incluye imports de Tailwind)
└── index.html                # HTML principal
tailwind.config.js            # Configuración de Tailwind CSS
angular.json                  # Configuración del CLI de Angular
package.json                  # Dependencias y scripts del proyecto
README.md                     # Este archivo
```
