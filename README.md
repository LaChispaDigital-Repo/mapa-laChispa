# Mapa Interactivo La Chispa

olo 

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

6.  **Para construir la aplicación para producción**

    ```bash
    npm run build
    ```

## Estructura del Proyecto

```plaintext
mapa-lachispa/
├── public/                                         # Archivos estáticos
├── src/                                            # Código fuente de la aplicación
├── ├── adapters/                                   # Adaptadores para parsear datos
│   ├── components/                                 # Componentes de React
│   │   ├── common/                                 # Componentes reutilizables y comunes
|   |   ├── DataDisplay/                            # Componentes para mostrar datos
│   │   |   ├── Charts/                             # Gráficos y visualizaciones
│   │   |   |   ├── CustomBarChart.tsx              # Gráfico de barras personalizado
│   │   |   |   ├── CustomPieChart.tsx              # Gráfico de pastel personalizado
│   │   |   ├── ShowInfo.tsx                        # Componente para mostrar información de capas
│   │   |   ├── ExcelExportButton.tsx               # Botón para exportar datos a Excel
│   |   ├── Map/                                    # Componentes relacionados con el mapa
│   │   |   ├── GeoJSONFeatures.tsx                 # Renderizado de datos geoJSON
│   │   |   ├── JuntasVecinosLayer.tsx              # Componente de capas de juntas de vecinos
│   │   |   ├── MapView.tsx                         # Vista principal del mapa
│   |   ├── FilterBar/                              # Barra de filtros y búsqueda
│   │   │   ├── FilterBar.tsx                       # Componente de agrupa los componentes de barra de filtros
│   │   │   ├── AdressSearch.tsx                    # Componente de búsqueda de direcciones
│   │   │   ├── UnidadVecinalSelector.tsx           # Componente de filtro por unidad vecinal
│   │   │   ├── RegionSelector.tsx                  # Componente de filtro por región
│   │   │   ├── CommuneSelector.tsx                 # Componente de filtro por comuna
│   │   │   ├── ProvinceSelector.tsx                # Componente de filtro por provincia
│   │   │   ├── FiltroJJVV.tsx                      # Componente de filtro por juntas de vecinos
│   │   ├── Footer.tsx                              # Componente Footer
│   ├── layout/                                     # Diseño y estructura de la aplicación
│   ├── store/                                      # Gestión del estado de la aplicación
│   │   ├── useMapStore.ts                          # Store global de Zustand para el mapa
│   │   ├── map-store.interface.ts                  # Definición de la interfaz del store
│   ├── types/                                      # Definiciones de interfaces TypeScript
│   ├── utils/                                      # Utilidades y funciones auxiliares
│   ├── App.tsx                                     # Componente principal de la aplicación
│   ├── index.css                                   # Estilos globales de la aplicación (Incorporación de Tailwind CSS y DaisyUI)
|   ├── main.tsx                                    # Archivo principal de configuración y renderizado
|   ├── supabaseClient.ts                           # Cliente de Supabase para la conexión a la base de datos
├── tsconfig.json                                   # Configuración de TypeScript
├── package.json                                    # Dependencias y scripts del proyecto
├── vite.config.ts                                  # Configuración de Vite
├── README.md                                       # Documentación del proyecto
├── .gitignore                                      # Archivos y directorios a ignorar por Git
├── .env                                            # Variables de entorno (Conexión a Supabase)
├── index.html                                      # Archivo HTML principal (DaisyUI --> Data-theme)
```

## Dependencias del Proyecto

El proyecto utiliza varias dependencias clave para su funcionamiento:

- **React**: Biblioteca principal para construir la interfaz de usuario.
- **TypeScript**: Lenguaje de programación que añade tipado estático a JavaScript
- **Vite**: Herramienta de construcción y desarrollo rápida para aplicaciones web modernas.
- **React-Leaflet**: Biblioteca para integrar Leaflet con React, permitiendo la creación de mapas interactivos.
- **Zustand**: Librería para la gestión del estado global de la aplicación.
- **Supabase**: Plataforma de backend como servicio (BaaS) que proporciona una base de datos PostgreSQL y autenticación.
- **Recharts**: Biblioteca para crear gráficos y visualizaciones de datos en React.
- **Tailwind CSS**: Framework de CSS utilitario para crear diseños personalizados de manera rápida y eficiente.
- **DaisyUI**: Biblioteca de componentes basada en Tailwind CSS que proporciona componentes predefinidos y estilos adicionales.
- **ExcelJS**: Biblioteca para generar y manipular archivos Excel en JavaScript.
- **File-Saver**: Biblioteca para guardar archivos en el navegador, utilizada para la exportación de datos a Excel.

## ¿Cómo funciona el proyecto?

El proyecto está estructurado en varios componentes y módulos que interactúan entre sí para proporcionar una experiencia de usuario fluida y dinámica. A continuación, se describen los principales aspectos del funcionamiento del proyecto:

## Para la gestión de estado global se utiliza Zustand

Zustand es una librería ligera y eficiente para manejar el estado global de la aplicación.
Permite crear un store centralizado que puede ser accedido desde cualquier componente de la aplicación, facilitando la gestión de datos y la sincronización entre componentes.
[Documentación de Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)

## Para la gestión de mapas se utiliza React-Leaflet

React-Leaflet es una biblioteca que integra Leaflet con React, permitiendo crear mapas interactivos de manera sencilla y eficiente.
Proporciona componentes React que encapsulan la funcionalidad de Leaflet, facilitando la creación de mapas, marcadores y capas personalizadas.
[Documentación de React-Leaflet](https://react-leaflet.js.org/docs/start-introduction/)

## Para la gestión de datos se utiliza Supabase

Supabase es una plataforma de backend como servicio (BaaS) que proporciona una base de datos PostgreSQL, desde la cual se están generando endpoints para obtener datos geográficos y de capas.
[Supabase](https://supabase.com/)

## Para la gestión de gráficos se utiliza Recharts

Recharts es una biblioteca de gráficos para React que permite crear visualizaciones de datos de manera sencilla y personalizable.
Proporciona una amplia variedad de componentes para crear gráficos de barras, líneas, pasteles y más, facilitando la representación visual de datos complejos.
[Documentación de Recharts](https://recharts.org/en-US)

## Para los estilos se utiliza Tailwind CSS y DaisyUI

Tailwind CSS es un framework de CSS utilitario que permite crear diseños personalizados de manera rápida y eficiente.
Proporciona clases predefinidas que se pueden combinar para crear estilos personalizados sin necesidad de escribir CSS adicional.
DaisyUI es una biblioteca de componentes basada en Tailwind CSS que proporciona componentes predefinidos y estilos adicionales para facilitar el desarrollo de interfaces de usuario atractivas y funcionales.
[Documentación de Tailwind CSS](https://tailwindcss.com/docs/installation)
[Documentación de DaisyUI](https://daisyui.com/docs/install/)

## Las interfaces de TypeScript se encuentran en `src/types`

Las interfaces de TypeScript se utilizan para definir la estructura de los datos que maneja la aplicación. Estas interfaces permiten tener un tipado fuerte y una mejor autocompletación en el código, lo que facilita el desarrollo y la mantenibilidad del proyecto.

## ¿Cómo se estructura la aplicación?

La aplicación está estructurada en varios módulos y componentes, cada uno con una responsabilidad específica. A continuación, se describen los principales componentes y su función dentro de la aplicación:

## ¿Cuál es la página que renderiza toda la aplicación?

La página principal que renderiza toda la aplicación es `App.tsx`. Este componente es el punto de entrada de la aplicación y se encarga de configurar el contexto del mapa, los proveedores de estado y los componentes principales de la interfaz de usuario. Para nuestro caso, dentro de `App.tsx` estamos importando sólo un componente llamado `Layout`, que se encuentra en `src/layout/Layout.tsx`. Este componente es el encargado de renderizar la estructura general de la aplicación, incluyendo el mapa y los componentes secundarios como la barra de filtros, el mapa, los gráficos y el footer.

## ¿Cómo conectamos con Supabase?

La conexión con Supabase se realiza a través del archivo `src/supabaseClient.ts`, donde se configura el cliente de Supabase utilizando las credenciales proporcionadas en el archivo `.env`. Este cliente se utiliza para realizar consultas a la base de datos y obtener los datos necesarios para las capas del mapa. En este archivo, se importa la biblioteca `@supabase/supabase-js` y se inicializa el cliente con la URL y la clave de la API de Supabase. Por otro lado, utilizamos un adaptador para transformar los datos obtenidos de Supabase en un formato adecuado para ser utilizados en la aplicación. Este adaptador se encuentra en `src/adapters/supabase.adapter.ts`, donde se definen las funciones para adaptar los datos de unidades vecinales y juntas de vecinos, asegurando que la estructura de los datos sea compatible con el resto de la aplicación.

## Nuestro estado global se encuentra en `src/store/useMapStore.ts`

Este archivo define el store global de la aplicación utilizando Zustand. Aquí se gestionan los estados relacionados con el mapa, como las capas visibles, los datos de las unidades vecinales y juntas de vecinos, y otros estados relevantes para la funcionalidad del mapa. El store permite acceder y modificar estos estados desde cualquier componente de la aplicación, facilitando la sincronización y actualización de la interfaz de usuario.

- Para acceder al store, se utiliza el hook `useMapStore` que se importa en los componentes donde se necesite acceder a los estados o acciones definidas en el store.
- Para modificar la estructura de nuestra store, se deben seguir las siguientes pautas:
  - Se pueden añadir nuevos estados, acciones, funciones, getters y setters al store definiéndolos en la interface `map-store.interface.ts`
  - Se deben implementar todas las funciones definidas en `map-store.interface.ts` correspondientes en el store `useMapStore.ts` para manejar la lógica de negocio asociada a esos nuevos estados.
  - Se deben seguir las convenciones de nomenclatura y estructura del store para mantener la coherencia y legibilidad del código.
  - Para hacer uso del store, se debe importar el hook `useMapStore` en los componentes donde se necesite acceder a los estados o acciones definidas en el store.

## ¿Cómo funciona el control de capas?

El control de capas se gestiona a través del componente `LayerControl` dentro del componente `MapView.tsx`. Este componente permite al usuario seleccionar qué capas desea visualizar en el mapa. Para agregar una capa nueva, se debe seguir el siguiente proceso:

1. **Crear un nuevo componente de capa**: Este componente debe definir cómo se renderiza la capa en el mapa, utilizando los hooks de React-Leaflet.
2. **Importar el nuevo componente en `MapView.tsx`**: Una vez creado el componente de capa, se debe importar en `MapView.tsx`.
   - Añadir la lógica para mostrar u ocultar la capa según la selección del usuario en el menú de capas.
   - Para que esta funcionalidad sea seleccionable, se debe registrar la nueva capa dentro del hook `LayerControl`, y envuelta en `LayersControl.Overlay` para que se pueda activar o desactivar desde el menú de capas.

## ¿Cómo funcionan los filtros?

Los filtros se gestionan a través del componente `FilterBar.tsx`, que permite al usuario aplicar diferentes criterios de búsqueda y filtrado a los datos mostrados en el mapa.
Este componente funciona como un agrupador de los diferentes filtros disponibles, permitiendo al usuario seleccionar criterios específicos para refinar la visualización de los datos. De esta forma, para agregar un nuevo filtro, se debe:

1. **Crear un nuevo componente de filtro**: Este componente debe definir la lógica y la interfaz del nuevo filtro.
2. **Importar el nuevo componente**: Una vez creado el componente de filtro, se debe importar en `FilterBar.tsx`.
   Cada uno de los filtros, dependiendo de su tipo, puede interactuar con el store global para actualizar los datos mostrados en el mapa y en los gráficos. Por ejemplo, al seleccionar un filtro de unidad vecinal, se actualiza el estado `selectedUnidadVecinal` en el store, lo que a su vez actualiza los datos mostrados en el mapa y en los gráficos correspondientes. Por ende, los filtros en general interactuan y actualizan el estado global de la aplicación, permitiendo una experiencia de usuario más dinámica y personalizada.

## ¿Cómo funcionan los gráficos?

Los gráficos se gestionan a través del componente `DataDisplay/ShowInfo.tsx`, que es el componente encargado de importar los datos desde la store y repartir los datos a los diferentes componentes de gráficos. La variable principal que se utiliza para los gráficos es `demographicData`, que hace referencia a los datos de la capa seleccionada por el usuario. En el directorio `src/adapters/demographicDataForGraphic.adapter.ts` se encuentra el adaptador que transforma los datos de la capa seleccionada en un formato adecuado para ser utilizado por los gráficos. Este adaptador es responsable de procesar los datos y devolverlos en una estructura que los componentes de gráficos puedan entender y renderizar correctamente. Luego, desde `ShowInfo.tsx`, se importan los componentes de gráficos necesarios, como `Charts/CustomBarChart.tsx` y `Charts/CustomPieChart.tsx`, para mostrar los datos procesados de manera visualmente atractiva y comprensible para el usuario. El flujo de datos es el siguiente:

1. El usuario selecciona un filtro en el mapa.
2. El componente `FilterBar.tsx` actualiza el estado global de la store con los nuevos criterios de filtrado, incluyendo la función setDemographicData, la cual parsea los datos y setea tres variables:
   - demographicData => Que son la totalidad de los datos. Esta es la fuente de los datos que no muta, ya que también la utilizamos para exportar a Excel.
   - pieData => Que son los datos que se muestran en el gráfico de pastel.
   - barData => Que son los datos que se muestran en el gráfico de barras.
3. El componente `ShowInfo.tsx` recibe estos datos y los pasa a los componentes de gráficos correspondientes.
4. Los componentes de gráficos renderizan los datos utilizando las bibliotecas de visualización, como Recharts, para mostrar los gráficos de barras y de pastel.

## ¿Cómo funciona la exportación a Excel?

La exportación a Excel se gestiona a través del componente `DataDisplay/ExcelExportButton.tsx`, que utiliza la biblioteca `exceljs` y `file-saver` para generar un archivo Excel a partir de los datos procesados en la store. El flujo de exportación es el siguiente:

1. El usuario hace clic en el botón de exportación a Excel.
2. El componente `ExcelExportButton.tsx` accede a los datos de la store, específicamente a la variable `demographicData`, que contiene los datos de la capa seleccionada.
3. Utiliza la biblioteca `exceljs` para crear un nuevo libro de trabajo y una hoja de cálculo.
4. Los datos se formatean y se agregan a la hoja de cálculo.
5. Finalmente, se utiliza `file-saver` para descargar el archivo Excel generado.

## ¿Cómo funciona el renderizado de los datos geoJSON?

El renderizado de los datos geoJSON se gestiona a través del componente `Map/GeoJSONFeatures.tsx`, que utiliza la biblioteca React-Leaflet para renderizar los datos geoJSON en el mapa. El flujo de renderizado es el siguiente:

1. El componente `GeoJSONFeatures.tsx` recibe los datos geoJSON desde la store, específicamente la variable `regionGeoJSON`, que contiene los datos geográficos de la región seleccionada.
2. Para el renderizado dinámico según la selección del usuario, se utiliza el hook `useMapStore` para acceder a los datos y funciones del store, específicamente al getter `getFilteredUVFeatures`, el cual filtra los datos geoJSON según la selección regional, provincial, comunal y de unidad vecinal.

## ¿Cómo funcionan los estilos?

Los estilos de la aplicación se gestionan principalmente a través de Tailwind CSS y DaisyUI. Los estilos globales se definen en el archivo `index.css`, donde se importan las clases de Tailwind CSS y DaisyUI. Además, cada componente puede tener sus propios estilos específicos utilizando clases de Tailwind CSS directamente en el TSX. Actualmente en `src/index.html` se encuentra el tema de DaisyUI, que es el tema por defecto de la aplicación. Para cambiar el tema, se puede modificar el atributo `data-theme` en el elemento `<html>` del archivo `index.html`. DaisyUI proporciona varios temas predefinidos que se pueden utilizar para personalizar la apariencia de la aplicación. Los temas se pueden revisar en la [documentación de DaisyUI](https://daisyui.com/docs/themes/) para ver las opciones disponibles y cómo aplicarlas, así como también revisar en `index.css`, daisyui, themes, donde están importados los temas disponibles para usar y aplicar en `index.html`.
