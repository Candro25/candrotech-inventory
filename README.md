# CandroTech - App de Gestión de Inventario

## Descripción
CandroTech es una aplicación móvil diseñada para facilitar la administración y el control de inventario de productos. Desarrollada con React Native y Expo, la aplicación permite a los usuarios registrar nuevos artículos, generar o escanear códigos de barras físicos, y mantener una base de datos local persistente sin necesidad de conexión a internet.

## Características Principales
* **Navegación por Pestañas:** Interfaz dividida lógicamente entre la pantalla de registro (Home) y la visualización de datos (Inventario).
* **Escáner de Códigos de Barras:** Integración nativa con la cámara del dispositivo para leer formatos estándar (EAN13, EAN8, Code128, QR) y agilizar el registro.
* **Persistencia de Datos:** Uso de AsyncStorage para guardar, recuperar y eliminar productos de forma segura en la memoria del dispositivo.
* **Diseño Adaptativo:** Soporte completo e inmediato para Dark Mode y Light Mode dependiendo de la configuración del sistema operativo del usuario.
* **Validación Robusta:** Sistema anti-crashes que filtra datos corruptos y previene la creación de registros incompletos.

## Tecnologías Utilizadas
* React Native
* Expo (Expo Router para navegación)
* TypeScript
* Expo Camera
* React Native Async Storage

## Instalación y Ejecución Local

1. Clona este repositorio:
   git clone https://github.com/Candro25/candrotech-inventory.git

2. Instala las dependencias:
   npm install

3. Inicia el servidor de desarrollo de Expo:
   npx expo start

4. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil (Android/iOS) para probar la aplicación.
