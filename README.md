# Mapa Interactivo La Chispa

Una aplicación de mapa interactivo diseñada para visualizar datos geográficos relevantes El proyecto está construido con React, TypeScript y Vite, utilizando React-Leaflet para la renderización de mapas.

## Funcionalidades Actuales

- **Mapa Interactivo:** Navegación fluida con controles de zoom y desplazamiento.
- **Control de Capas:** Un menú permite al usuario activar o desactivar la visibilidad de las diferentes capas de datos disponibles.
- **Clustering de Marcadores:** Optimización de rendimiento para capas con un gran número de puntos, agrupándolos visualmente para evitar la saturación del mapa.

## Capas Disponibles

1.  **Unidades Vecinales:** Muestra los polígonos que definen las áreas de las unidades vecinales de la comuna.
2.  **Juntas de Vecinos:** Muestra la ubicación de aproximadamente 1500 juntas de vecinos a través de marcadores individuales, agrupados en clusters para una mejor visualización.

---

## Instrucciones de Instalación y Uso

### Prerrequisitos

- Node.js y npm instalados.

### Pasos

1.  **Clonar el repositorio**
    (Reemplazar `<URL_DEL_REPOSITORIO>` con la URL real)

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Ingresar al directorio del proyecto e instalar dependencias**

    ```bash
    cd mapa-lachispa
    npm install
    ```

3.  **Iniciar el servidor en modo desarrollo**

    ```bash
    npm run dev
    ```

4.  **Abrir el navegador y acceder a la aplicación**
    La aplicación estará disponible en la URL que indique la consola, generalmente:

    ```plaintext
    http://localhost:5173
    ```

5.  **Detener el servidor**
    En la terminal donde se ejecuta `npm run dev`, presionar:
    ```bash
    Ctrl + C
    ```

## Estructura del Proyecto

```plaintext
mapa-lachispa/
├── public/                             # Archivos estáticos
├── src/                                # Código fuente de la aplicación
├── ├── adapters/                       # Adaptadores para parsear datos
│   ├── components/                     # Componentes de React
│   │   ├── common/                     # Componentes reutilizables y comunes
|   |   ├── DataDisplay/                # Componentes para mostrar datos
│   │   |   ├── Charts/                 # Gráficos y visualizaciones
│   │   |   ├── ShowInfo.tsx            # Componente para mostrar información de capas
│   │   |   ├── ExcelExportButton.tsx   # Botón para exportar datos a Excel
│   |   ├── Map/                        # Componentes relacionados con el mapa
│   |   ├── FilterBar/                  # Barra de filtros y búsqueda
│   │   ├── Footer.tsx                  # Componente Footer
│   ├── layout/                         # Diseño y estructura de la aplicación
│   ├── store/                          # Gestión del estado de la aplicación
│   ├── types/                          # Definiciones de interfaces TypeScript
│   ├── utils/                          # Utilidades y funciones auxiliares
│   ├── App.tsx                         # Componente principal de la aplicación
│   ├── index.css                       # Estilos globales de la aplicación (Incorporación de Tailwind CSS y DaisyUI)
│   ├── index.tsx                       # Punto de entrada de la aplicación
|   ├── main.tsx                        # Archivo principal de configuración y renderizado
|   ├── supabaseClient.ts               # Cliente de Supabase para la conexión a la base de datos
├── tsconfig.json                       # Configuración de TypeScript
├── package.json                        # Dependencias y scripts del proyecto
├── vite.config.ts                      # Configuración de Vite
├── README.md                           # Documentación del proyecto
├── .gitignore                          # Archivos y directorios a ignorar por Git
├── .env                                # Variables de entorno (Conexión a Supabase)
├── index.html                          # Archivo HTML principal (DaisyUI --> Data-theme)
```
