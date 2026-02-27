import sys
from pathlib import Path

# Agregar la raíz del proyecto al path para los imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.database import insert_producto

if __name__ == "__main__":
    try:
        nuevo_id = insert_producto(
            nombre='carming rojo pasion',
            categoria='labios',
            descripcion='muy bueno genial',
            precio_de_compra=2.50,
            precio_de_venta=3.50,
            stock=100,
            proveedor='Proveedor XYZ',
            estado='Activo'
        )

        print('🆔 ID producto insertado →', nuevo_id)
    except Exception as e:
        print('❌ Error al insertar producto →', e)

# ===== EJECUCIÓN DESDE CMD =====
# python tests/test_insert_producto.py
