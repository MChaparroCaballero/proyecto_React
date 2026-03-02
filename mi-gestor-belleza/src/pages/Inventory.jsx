import React from 'react'
import Panel from '../components/Panel'

// Página de inventario
// Muestra la lista de productos y permite buscar, editar o eliminar
export default function Inventory({
  productos,
  loading,
  searchId,
  setSearchId,
  searchResult,
  handleSearch,
  handleDelete,
  onStartEdit,
}) {
  return (
    <Panel>
      <div className="panel-header">
        <h2>Inventario en vivo</h2>
        <p>Actualiza, edita o elimina desde la misma vista.</p>
      </div>

      <form className="search" onSubmit={handleSearch}>
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
      </form>

      {searchResult ? (
        <div className="highlight">
          <div>
            <h3>{searchResult.nombre}</h3>
            <p>{searchResult.descripcion}</p>
          </div>
          <div className="highlight-meta">
            <span>#{searchResult.cod}</span>
            <span>{searchResult.categoria}</span>
            <span>{searchResult.estado}</span>
          </div>
        </div>
      ) : null}

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
            {productos.map((producto) => (
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
                    <button
                      type="button"
                      onClick={() => {
                        onStartEdit(producto)
                      }}
                    >
                      Editar
                    </button>
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
        {!productos.length && !loading ? (
          <p className="empty">No hay productos aun. Crea el primero.</p>
        ) : null}
      </div>
    </Panel>
  )
}
