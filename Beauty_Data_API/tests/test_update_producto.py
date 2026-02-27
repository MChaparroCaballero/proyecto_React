import sys
from pathlib import Path

# Agregar la raíz del proyecto al path para los imports
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.database import update_producto

if __name__ == "__main__":
    try:
        resultado = update_producto(
            cod=1,
            nombre='carming naranja pasion',
            categoria='labios',
            descripcion='muy bueno genial',
            precio_de_compra=2.50,
            precio_de_venta=3.50,
            stock=50,
            proveedor='Proveedor XYZ',
            estado='Activo'
        )

        if resultado:
            print('✅ Producto actualizado correctamente')
        else:
            print('⚠️ Producto no encontrado')
    except Exception as e:
        print('❌ Error al actualizar producto →', e)

# ===== EJECUCIÓN DESDE CMD =====
# python tests/test_update_producto.py
