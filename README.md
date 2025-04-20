# Prueba Técnica – Desarrollo de Sistema CRUD (Frontend)

## 📋 Descripción del Proyecto

Este frontend ha sido desarrollado con **Vue 3**, utilizando **Vuetify** como sistema de diseño de componentes UI y **Pinia** para la gestión de estado. La aplicación permite gestionar de forma intuitiva los **comensales**, **mesas** y **reservas** de un restaurante, interactuando con un backend desarrollado en **Laravel** y una base de datos **MySQL**.

## 🛠 Tecnologías Clave
| Tecnología | Propósito |
|------------|-----------|
| **Vue.js 3** | Framework base para componentes y reactividad |
| **Vuetify** | Sistema de diseño Material UI para componentes pre-construidos |
| **Pinia** | Gestión centralizada de estado de la aplicación |
| **Axios** | Comunicación HTTP con el backend |
| **Vue Router** | Navegación entre vistas y rutas |

---

## 🎯 Funcionalidades Implementadas (CRUD)

### 1. Comensales
- Crear nuevo comensal.
- Ver listado de comensales.
- Editar información del comensal.
- Eliminar comensales.

Campos requeridos:
- `nombre` (string, requerido)
- `correo` (string, requerido, debe tener formato email)
- `telefono` (string, opcional)
- `direccion` (string, opcional)

### 2. Mesas
- Crear nueva mesa.
- Ver listado de mesas.
- Editar información de mesa.
- Eliminar mesa.

Campos requeridos:
- `numero_mesa` (string o integer, requerido)
- `capacidad` (integer, requerido)

### 3. Reservas
- Crear reserva asignando comensal y mesa.
- Ver listado de reservas.
- Editar reserva.
- Eliminar reserva.

Campos requeridos:
- `fecha` (date, requerido)
- `hora` (time, requerido)
- `numero_de_personas` (integer, requerido)
- `comensal_id` (relación)
- `mesa_id` (relación)

---

## 🧑‍💻 Instalación y Puesta en Marcha

### Requisitos Previos

- Node.js 18+
- NPM o Yarn


### Pasos para instalación

```bash
# 1. Clonar el repositorio
https://github.com/rivacortez/Frontend-Desarrollo-de-Sistema-CRUD

# 2. Ir al directorio del frontend
cd frontend

# 3. Instalar dependencias
npm install

# 4. Levantar el proyecto
npm run dev