# 📚 BeautyApp API REST - Guía Educativa

## API de Gestión de Inventario de Productos de Belleza
**Por:** María Chaparro Caballero  
**ID Académico:** [Tu número de identificación aquí]  
**Perfil de GitHub:** [MChaparroCaballero](https://github.com/MChaparroCaballero)

---

## 💅 1. Caso de Uso: Historia de Beauty Data
**Beauty Data** es una distribuidora de cosméticos y productos de cuidado personal que maneja un catálogo extenso de marcas. Originalmente, el inventario se gestionaba en hojas de cálculo, lo que generaba errores en el stock y falta de claridad en los márgenes de ganancia.

En 2026, la empresa decidió implementar esta **API REST** para centralizar la información de la tabla única `productos`, permitiendo que tanto el almacén como los puntos de venta tengan acceso inmediato a los precios de compra, venta y disponibilidad real de cada artículo.

---

## 🎯 2. El Problema a Resolver
El sistema permite la gestión integral del ciclo de vida de los productos:
* **Control financiero:** Seguimiento de `precio_de_compra` y `precio_de_venta`.
* **Gestión de stock:** Actualización en tiempo real de unidades disponibles.

---

## 📋 3. Especificación de Requisitos

### Estructura de la Tabla: `productos` (BD: `beauty_data`)

| Campo | Tipo | Restricción |
| :--- | :--- | :--- |
| **cod** | INT (PK) | Autoincremental |
| **nombre** | VARCHAR(200) | No Nulo |
| **categoria** | VARCHAR(200) | Maquillaje, Skin-care, Capilar |
| **descripcion** | VARCHAR(200) | Opcional |
| **precio_de_compra** | DECIMAL(10,2) | Valor positivo |
| **precio_de_venta** | DECIMAL(10,2) | Valor positivo |
| **stock** | INT | Mínimo 0 |
| **proveedor** | VARCHAR(200) | Marca o distribuidor |
| **estado** | VARCHAR(20) | Activo / Inactivo |

---

## 🏗️ 4. Conceptos de Arquitectura de Software
La aplicación sigue una **Arquitectura en Capas**:
1.  **Presentación (API):** Endpoints en FastAPI que reciben peticiones JSON.
2.  **Lógica (Modelos):** Esquemas de Pydantic para validar datos antes de procesar.
3.  **Acceso a Datos (DAL):** Funciones SQL directas para interactuar con la base de datos.

---

## 📦 5. Librerías Python y su Función
* **FastAPI:** El núcleo del servidor y gestor de rutas.
* **Pydantic:** Validación estricta de los esquemas de datos.
* **mysql-connector-python:** Driver para conectar con MariaDB/MySQL.
* **python-dotenv:** Carga de variables de entorno seguras.
* **Uvicorn:** Servidor ASGI para ejecutar la aplicación.

---

## 📁 6. Estructura del Proyecto
```text
BeautyApp/
├── app/
│   ├── main.py          # Definición de rutas y esquemas Pydantic
│   └── database.py      # Lógica de conexión y CRUD SQL
├── .env                 # Variables de entorno (Host, User, Pass)
├── requirements.txt     # Listado de dependencias
└── README.md            # Documentación
```
--- 

## 🚀 7. Instalación y Ejecución

Sigue estos pasos para configurar y poner en marcha la API en tu entorno local:

### 1. Clonar y preparar entorno
Ejecuta los siguientes comandos en tu terminal para configurar el entorno virtual e instalar las dependencias:

```bash
# Crear el entorno virtual
python -m venv venv

# Activar el entorno virtual
# En macOS/Linux:
source venv/bin/activate  
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

---

## 🔌 8. Endpoints de la API

La API expone los siguientes puntos de acceso para la gestión del inventario:

| Método | Endpoint | Acción |
| :--- | :--- | :--- |
| **GET** | `/productos` | Lista todo el inventario de belleza. |
| **GET** | `/productos/{cod}` | Busca un producto específico por su código único. |
| **POST** | `/productos` | Crea un nuevo registro de producto en la base de datos. |
| **PUT** | `/productos/{cod}` | Actualiza stock, precios o estado de un producto existente. |
| **DELETE** | `/productos/{cod}` | Elimina permanentemente un producto del sistema. |

### Ejemplo de Cuerpo de Petición (JSON) para POST:
Al crear un producto, asegúrate de enviar los datos con la siguiente estructura:

```json
{
  "nombre": "Sérum Hidratante",
  "categoria": "Skin-care",
  "descripcion": "Ácido hialurónico 2%",
  "precio_de_compra": 12.50,
  "precio_de_venta": 28.00,
  "stock": 15,
  "proveedor": "L'Oréal",
  "estado": "Activo"
}

---

## ✅ 9. Validaciones Implementadas

Para garantizar la integridad de la información en **Beauty Data**, se han aplicado las siguientes capas de validación:

* **Restricciones de Longitud:** Los campos principales tienen límites definidos (ej. Nombre máx. 80 caracteres, Categoría máx. 50) para proteger la estructura de la BD.
* **Validación de Rangos:** Uso de reglas estricta para que `precio_de_compra`, `precio_de_venta` y `stock` no acepten valores negativos (`ge=0`).
* **Saneamiento Automático (Trim):** Se eliminan espacios en blanco accidentales en los extremos de los textos antes de procesarlos.
* **Tratamiento de Opcionales:** La descripción se normaliza automáticamente; si se envía vacía, el sistema la almacena como un valor nulo real.
* **Compatibilidad de Tipos:** El sistema realiza una conversión segura de tipos `Decimal` (MySQL) a `float` (JSON) durante el mapeo de datos.

---

## 🎨 10. Patrones de Diseño Utilizados

El desarrollo sigue buenas prácticas de ingeniería de software para facilitar el mantenimiento:

* **Repository Pattern:** Todas las consultas y sentencias SQL están centralizadas en `database.py`, aislando la lógica de datos de las rutas.
* **Data Transfer Object (DTO):** Uso de modelos de **Pydantic** para definir exactamente qué datos entran y salen de la API, protegiendo la estructura interna de la base de datos.
* **Inyección de Dependencias:** Se utiliza el sistema nativo de FastAPI para gestionar de forma eficiente la conexión a la base de datos y las dependencias de los modelos.

