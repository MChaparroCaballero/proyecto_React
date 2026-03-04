import React, { useEffect } from 'react'
import Panel from '../components/Panel'
import Select from 'react-select'
import { useParams } from 'react-router-dom'

// Página para editar un producto
// Permite elegir un producto o cargarlo por id en la ruta
export default function Edit({
  editForm,
  setEditForm,
  handleEditSubmit,
  loading,
  productos,
  productOptions,
  handleProductoSelect,
  fetchAndStartEdit,
}) {
  const params = useParams()

  useEffect(() => {
    // Si la ruta tiene id, cargar ese producto en el formulario
    if (params.id) {
      const idNum = Number(params.id)
      if (String(editForm.cod) !== String(idNum)) {
        fetchAndStartEdit(idNum)
      }
    }
  }, [params.id])

  return (
    <Panel>
      <div className="panel-header">
        <h2>Editar producto</h2>
        <p>Selecciona un producto de la tabla inventario para editarlo.</p>
      </div>
      {/* Formulario de edición */}
      <form className="form" onSubmit={handleEditSubmit}>
        <div className="field">
          {/* Selector para elegir producto */}
          <label>Producto</label>
          <Select
            styles={{}}
            classNamePrefix="react-select"
            options={productOptions}
            value={productOptions.find((o) => Number(o.value) === Number(editForm.cod)) || null}
            onChange={handleProductoSelect}
            isClearable
            placeholder="Selecciona uno"
          />
        </div>
        <div className="field">
          {/* Campo: nombre editable */}
          <label>Nombre</label>
          <input
            value={editForm.nombre}
            onChange={(event) => setEditForm((prev) => ({ ...prev, nombre: event.target.value }))}
            required
          />
        </div>
        <div className="field">
          {/* Campo: categoria editable */}
          <label>Categoria</label>
          <input
            value={editForm.categoria}
            onChange={(event) => setEditForm((prev) => ({ ...prev, categoria: event.target.value }))}
            required
          />
        </div>
        <div className="field">
          {/* Campo: descripcion editable */}
          <label>Descripcion</label>
          <input
            value={editForm.descripcion}
            onChange={(event) => setEditForm((prev) => ({ ...prev, descripcion: event.target.value }))}
            required
          />
        </div>
        <div className="field-grid">
          <div className="field">
            {/* Campo: precio de compra editable */}
            <label>Compra</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editForm.precio_de_compra}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, precio_de_compra: event.target.value }))
              }
              required
            />
          </div>
          <div className="field">
            {/* Campo: precio de venta editable */}
            <label>Venta</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editForm.precio_de_venta}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, precio_de_venta: event.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            {/* Campo: stock editable */}
            <label>Stock</label>
            <input
              type="number"
              min="0"
              value={editForm.stock}
              onChange={(event) => setEditForm((prev) => ({ ...prev, stock: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            {/* Campo: proveedor editable */}
            <label>Proveedor</label>
            <input
              value={editForm.proveedor}
              onChange={(event) => setEditForm((prev) => ({ ...prev, proveedor: event.target.value }))}
              required
            />
          </div>
        </div>
        <div className="field">
          {/* Campo: estado */}
          <label>Estado</label>
          <select
            value={editForm.estado}
            onChange={(event) => setEditForm((prev) => ({ ...prev, estado: event.target.value }))}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        {/* Botón para guardar cambios */}
        <button type="submit" disabled={loading}>
          Guardar cambios
        </button>
      </form>
    </Panel>
  )
}
