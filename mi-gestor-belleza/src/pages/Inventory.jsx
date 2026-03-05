import React from 'react'
import Panel from '../components/Panel'

// Página de inventario
// Lista los productos y permite buscar por id, editar o eliminar
export default function Inventory({
  productos,
  loading,
  searchId,
  setSearchId,
  searchResult,
  setSearchResult,
  handleSearch,
  handleDelete,
  onStartEdit,
}) {
  // Si hay resultado de búsqueda, mostrar solo ese producto
  const rows = searchResult ? [searchResult] : productos
  return (
    <Panel>
      <div className="panel-header">
        <h2>Inventario en vivo</h2>
        <p>Actualiza, edita o elimina desde la misma vista.</p>
      </div>

      <form className="search" onSubmit={handleSearch}>
        {/* Formulario de búsqueda por ID */}
        <input
          type="number"
          min="1"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={(event) => setSearchId(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          Buscar
        </button>
        {searchResult ? (
          <button
            type="button"
            onClick={() => {
              setSearchResult(null)
              setSearchId('')
            }}
            disabled={loading}
          >
            Mostrar todo
          </button>
        ) : null}
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Stock</th>
              <th>Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((producto) => (
              // Fila por cada producto a mostrar
              <tr key={producto.cod}>
                <td>#{producto.cod}</td>
                <td>
                  <div className="product-name">{producto.nombre}</div>
                  <span className="product-desc">{producto.descripcion}</span>
                </td>
                <td>{producto.categoria}</td>
                <td>{producto.stock}</td>
                <td>${producto.precio_de_venta}</td>
                <td>
                  <div className="actions">
                    {/* Botón para abrir edición */}
                    <button
                      type="button"
                      onClick={() => {
                        onStartEdit(producto)
                      }}
                    >
                      Editar
                    </button>
                    {/* Botón para pedir eliminación */}
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(producto.cod)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && !loading ? (
          <p className="empty">No hay productos aun. Crea el primero.</p>
        ) : null}
      </div>
    </Panel>
  )
}
