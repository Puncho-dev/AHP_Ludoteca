# Proyecto-Tutorial de Ludoteca. Alejandro Hernández Pascual

En este proyeto muestro los rtesultados del Tutorial de CCSW, realizado como parte de prácticas formativas de 2DAM. 
La aplicación permite gestionar clientes, autores, juegos y préstamos de videojuegos, con funcionalidades de validación, filtros por fecha, cliente o juego, paginación, y más.

## 🚀 Tecnologías utilizadas

### Backend (Java + Spring Boot)
- **Java 21**
- **Spring Boot**
- **Spring Web** (REST API)
- **Spring Data JPA**
- **Spring Validation**
- **H2 Database** (base de datos en memoria para pruebas)
- **JUnit 5** (pruebas unitarias e integración)
- **Maven**

### Frontend (Angular)
- **Angular 17+**
- **TypeScript**
- **Angular Material** / **Bootstrap**
- **RxJS**
- **HttpClient** (para REST)

## 📂 Estructura del proyecto

### Backend
- `/client`: CRUD de clientes
- `/author`: CRUD de autores
- `/game`: CRUD de juegos
- `/loan`: gestión de préstamos, con validaciones
- `/common`: incluye clases de paginación (PageableRequest), filtros (SearchCriteria), y más

### Frontend
- `client.component`: listado, alta, edición y borrado de clientes
- `game.component`: filtrado y gestión de videojuegos
- `author.component`: paginación y gestión de autores
- `loan.component`: paginación, filtrado, alta, baja y visualización de préstamos

/loan: gestión de préstamos, con validaciónes
/common: incluye clases de paginación (PageableRequest), filtros (SearchCriteria), y más
Frontend
client.component: listado, alta, edición y borrado de clientes
game.component: filtrado y gestión de videojuegos
author.component: paginación y gestión de autores
loan.component: paginación, filtrado, alta, baja y visualización de préstamos
