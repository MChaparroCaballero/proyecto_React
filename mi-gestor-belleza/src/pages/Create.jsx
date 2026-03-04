import React from 'react'
import Panel from '../components/Panel'

// Página para crear un nuevo producto
// Muestra un formulario y envía los datos con `handleCreate`
export default function Create({ createForm, setCreateForm, handleCreate, loading }) {
  return (
    <Panel>
      <div className="panel-header">
        <h2>Nuevo producto</h2>
        <p>Registra un producto nuevo en segundos.</p>
      </div>
      {/* Formulario de creación */}
      <form className="form" onSubmit={handleCreate}>
        <div className="field">
          {/* Campo: nombre del producto */}
          <label>Nombre</label>
          <input
            value={createForm.nombre}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, nombre: event.target.value }))
            }
            required
          />
        </div>
        <div className="field">
          {/* Campo: categoria */}
          <label>Categoria</label>
          <input
            value={createForm.categoria}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, categoria: event.target.value }))
            }
            required
          />
        </div>
        <div className="field">
          {/* Campo: descripcion corta */}
          <label>Descripcion</label>
          <input
            value={createForm.descripcion}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, descripcion: event.target.value }))
            }
            required
          />
        </div>
        <div className="field-grid">
          <div className="field">
            {/* Campo: precio de compra */}
            <label>Compra</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={createForm.precio_de_compra}
              onChange={(event) =>
                setCreateForm((prev) => ({
                  ...prev,
                  precio_de_compra: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="field">
            {/* Campo: precio de venta */}
            <label>Venta</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={createForm.precio_de_venta}
              onChange={(event) =>
                setCreateForm((prev) => ({
                  ...prev,
                  precio_de_venta: event.target.value,
                }))
              }
              required
            />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            {/* Campo: unidades en stock */}
            <label>Stock</label>
            <input
              type="number"
              min="0"
              value={createForm.stock}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, stock: event.target.value }))
              }
              required
            />
          </div>
          <div className="field">
            {/* Campo: proveedor del producto */}
            <label>Proveedor</label>
            <input
              value={createForm.proveedor}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, proveedor: event.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="field">
          {/* Campo: estado activo o inactivo */}
          <label>Estado</label>
          <select
            value={createForm.estado}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, estado: event.target.value }))
            }
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        {/* Botón para enviar el formulario */}
        <button type="submit" disabled={loading}>
          Guardar producto
        </button>
      </form>
    </Panel>
  )
}
