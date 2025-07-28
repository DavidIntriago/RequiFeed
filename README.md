# Requi-Feed

## Descripción

**Requi-Feed** es una aplicación web diseñada para gestionar requisitos y feedback de una manera eficiente y centralizada. El backend está construido con [NestJS](https://nestjs.com/), un marco de trabajo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. El frontend está desarrollado con [React](https://reactjs.org/), una biblioteca de JavaScript para construir interfaces de usuario.

## Características

*   **Gestión de Proyectos:** Crea y gestiona proyectos para organizar tus requisitos.
*   **Seguimiento de Requisitos:** Define, asigna y da seguimiento a los requisitos de tus proyectos.
*   **Feedback Centralizado:** Recopila y gestiona el feedback de los stakeholders en un solo lugar.
*   **Autenticación y Autorización:** Sistema de autenticación seguro con roles y permisos.

## Instalación

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (v14 o superior)
*   [npm](https://www.npmjs.com/)
*   [Docker](https://www.docker.com/) (opcional)

### Backend

1.  Navega al directorio `requi-feed_backend`:

    ```bash
    cd requi-feed_backend
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

3.  Crea un archivo `.env` a partir del archivo `.env.development` y modifica las variables de entorno según sea necesario.

4.  Ejecuta el servidor de desarrollo:

    ```bash
    npm run start:dev
    ```

### Frontend

1.  Navega al directorio `requi-feed_frontend`:

    ```bash
    cd requi-feed_frontend
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

3.  Ejecuta el servidor de desarrollo:

    ```bash
    npm run dev
    ```

### Docker

También puedes ejecutar la aplicación utilizando Docker Compose.

1.  Asegúrate de tener Docker y Docker Compose instalados.

2.  Desde el directorio raíz del proyecto, ejecuta el siguiente comando:

    ```bash
    docker-compose up -d
    ```

Esto levantará tanto el backend como el frontend en contenedores de Docker.
