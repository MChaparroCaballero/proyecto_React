[README.md](https://github.com/user-attachments/files/25670337/README.md)
# Beauty Data - Proyecto (Frontend + Backend)

Descripción
-----------
Aplicación de ejemplo para gestionar productos de belleza. Incluye:
- Frontend en React (cliente): interfaz para listar, crear, editar y eliminar productos.
- Backend en Python (FastAPI): API REST que expone endpoints CRUD y se conecta a MySQL/MariaDB.

Tecnologías usadas
------------------
- Frontend: React, Vite, axios, react-select, react-router-dom
- Backend: FastAPI, Pydantic
- Base de datos: MySQL / MariaDB (script de inicialización incluido)

Estructura relevante
--------------------
- `mi-gestor-belleza/` — código del frontend (Vite + React)
  - `src/` — código fuente del cliente
  - `src/pages/` — páginas separadas (Inventory, Create, Edit)
- `Beauty_Data_API/` — backend FastAPI
  - `app/main.py` — definición de endpoints
  - `app/database.py` — funciones de acceso a la BD
  - `docs/init_db.sql` — script para crear la BD y datos de ejemplo

Requisitos previos
------------------
- Node.js + npm
- Python 3.10+ y pip
- MySQL o MariaDB (local o contenedor)

Instalación y ejecución (Backend)
---------------------------------
1. Ir a la carpeta del backend:

```bash
cd Beauty_Data_API
```

2. Crear y activar entorno virtual, instalar dependencias:

```bash
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

3. Crear la base de datos y datos de prueba (usar `init_db.sql`):

 - Abrir `Beauty_Data_API/docs/init_db.sql` y ejecutarlo en tu cliente MySQL (phpMyAdmin, MySQL CLI, Workbench, etc.).

4. Configurar variables de entorno para la conexión a BD (opcional):

Crea un fichero `.env` en `Beauty_Data_API` con las variables:

```
DB_HOST=localhost
DB_USER=beauty_data
DB_PASSWORD=beauty_data
DB_NAME=beauty_data
DB_PORT=3306
```

5. Iniciar la API:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

La API quedará disponible en `http://127.0.0.1:8000` y la documentación en `/docs`.

Instalación y ejecución (Frontend)
----------------------------------
1. Ir a la carpeta del cliente:

```bash
cd mi-gestor-belleza
```

2. Instalar dependencias y levantar el servidor de desarrollo:

```bash
npm install
npm run dev
```

3. Abrir el navegador en `http://localhost:5173` (por defecto). El frontend por defecto apunta a `http://127.0.0.1:8000`. Si tu API usa otra URL, crea o ajusta la variable de entorno `VITE_API_URL`.

Puntos importantes
------------------
- CORS: El backend incluye configuración CORS para `http://localhost:5173` (puerto Vite). Si sirves el frontend desde otro origen, añade dicho origen en `main.py`.
- Variables: la conexión DB depende de las variables en el entorno o `.env`.
- Servicios: se recomienda centralizar llamadas HTTP en `src/services/` para mejor mantenimiento.

Capturas de pantalla
---------------------
Incluye aquí imágenes que muestren la app en ejecución. Puedes crear una carpeta `screenshots/` en la raíz o colocarlas en `mi-gestor-belleza/public/`.

Ejemplos de rutas de captura (añade los archivos manualmente):
### 📦 Inventario
<p align="center">
  <img width="100%" alt="Inventario" src="https://github.com/user-attachments/assets/aa48b118-b230-4fdb-a543-b61a0bc9c848" />
</p>

### 🌅 Landing (Modo Claro)
<p align="center">
  <img width="100%" alt="landing claro"src="https://github.com/user-attachments/assets/82d484e0-cf03-4a7f-bd1e-53f0948eb274"/>
</p>

### 🌑 Landing (Modo Oscuro)
<p align="center">
  <img width="100%" alt="landing oscuro" src="https://github.com/user-attachments/assets/aa48b118-b230-4fdb-a543-b61a0bc9c848" />
</p>

### 📝 Editar Producto
<p align="center">
  <img width="100%" alt="editar" src="https://github.com/user-attachments/assets/bdc66522-43a2-400e-a2d5-d662b348ccda" />
</p>

### ✅ Después de Editar
<p align="center">
  <img width="100%" alt="despue_editar"  src="https://github.com/user-attachments/assets/bbc8e33c-29eb-490a-bceb-6a6208045274" />
</p>

### ➕ Nuevo Producto
<p align="center">
  <img width="100%" alt="nuevo_producto" src="https://github.com/user-attachments/assets/bf0e6351-8a56-499a-98ce-50e34cca9635" />
</p>

### ✨ Confirmación Nuevo Producto
<p align="center">
  <img width="100%" alt="despues_nuevo_producto" src="https://github.com/user-attachments/assets/cead915d-e4a7-4613-82f5-6d14e3028cf2" />
</p>

### Buscar producto
<p align="center">
  <img width="100%" alt="buscar_por_id" src="https://github.com/user-attachments/assets/92b3fd49-bcd8-4878-8432-9e21711c33a3" />
 />
</p>

### 🗑️ Eliminar Producto
<p align="center">
  <img width="100%" alt="eliminar_producto" src="https://github.com/user-attachments/assets/4536f159-2a86-4601-8c65-34957b35519a" />
</p>

### 🏁 Estado Final
<p align="center">
  <img width="100%" alt="despues_eliminar" src="https://github.com/user-attachments/assets/af2bd15f-47d2-4636-9095-0aaf2d250241" />
</p>





Contacto y notas
----------------
Si algo no arranca, verifica:
- Que MySQL esté funcionando y las credenciales sean correctas.
- Que la API esté corriendo antes de iniciar el frontend.
- Que `VITE_API_URL` apunte a la URL correcta de la API.

---
Archivo generado automáticamente: README de nivel raíz para el proyecto `proyecto_React`.
