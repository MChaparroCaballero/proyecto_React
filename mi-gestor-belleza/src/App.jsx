import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Panel from './components/Panel'
import AlertSuccess from './components/AlertSuccess'
import AlertError from './components/AlertError'
import Select from 'react-select'
import ConfirmDialog from './components/ConfirmDialog'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

const emptyForm = {
  nombre: '',
  categoria: '',
  descripcion: '',
  precio_de_compra: '',
  precio_de_venta: '',
  stock: '',
  proveedor: '',
  estado: 'Activo',
}

function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [createForm, setCreateForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState({ ...emptyForm, cod: '' })
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [activeTab, setActiveTab] = useState('inventory')
  const [isDark, setIsDark] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const stats = useMemo(() => {
    if (!productos.length) {
      return { total: 0, stock: 0, margen: 0 }
    }
    const totalStock = productos.reduce((sum, p) => sum + Number(p.stock || 0), 0)
    const totalMargin = productos.reduce(
      (sum, p) => sum + (Number(p.precio_de_venta || 0) - Number(p.precio_de_compra || 0)),
      0,
    )
    return {
      total: productos.length,
      stock: totalStock,
      margen: totalMargin / productos.length,
    }
  }, [productos])

  useEffect(() => {
    loadProductos()
  }, [])

  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', 'light')
    }
  }, [isDark])

  const setMessage = (type, message) => {
    setStatus({ type, message })
  }

  const loadProductos = async () => {
    setLoading(true)
    try {
      const response = await api.get('/productos')
      setProductos(Array.isArray(response.data) ? response.data : [])
      // No mostrar alerta de éxito al cargar/recargar productos
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No se pudo cargar: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const normalizePayload = (form) => ({
    nombre: form.nombre.trim(),
    categoria: form.categoria.trim(),
    descripcion: form.descripcion.trim(),
    precio_de_compra: Number(form.precio_de_compra),
    precio_de_venta: Number(form.precio_de_venta),
    stock: Number(form.stock),
    proveedor: form.proveedor.trim(),
    estado: form.estado.trim() || 'Activo',
  })

  const handleCreate = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload = normalizePayload(createForm)
      const response = await api.post('/productos', payload)
      setProductos((prev) => [response.data, ...prev])
      setCreateForm(emptyForm)
      setMessage('success', 'Producto creado.')
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No se pudo crear: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    if (!editForm.cod) {
      setMessage('error', 'Selecciona un producto para editar.')
      return
    }
    setLoading(true)
    try {
      const payload = normalizePayload(editForm)
      const response = await api.put(`/productos/${editForm.cod}`, payload)
      setProductos((prev) =>
        prev.map((item) => (item.cod === response.data.cod ? response.data : item)),
      )
      setEditForm({ ...emptyForm, cod: '' })
      setMessage('success', 'Producto actualizado.')
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No se pudo actualizar: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Open confirm dialog (actual deletion happens in confirmDeleteAction)
  const handleDelete = (productoId) => {
    setConfirmDelete(productoId)
  }

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return
    setConfirmLoading(true)
    try {
      await api.delete(`/productos/${confirmDelete}`)
      setProductos((prev) => prev.filter((item) => item.cod !== confirmDelete))
      setMessage('success', 'Producto eliminado.')
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No se pudo eliminar: ${errorMessage}`)
    } finally {
      setConfirmLoading(false)
      setConfirmDelete(null)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!searchId) {
      setMessage('error', 'Introduce un ID para buscar.')
      return
    }
    setLoading(true)
    try {
      const response = await api.get(`/productos/${searchId}`)
      setSearchResult(response.data)
      setMessage('success', 'Producto encontrado.')
    } catch (error) {
      setSearchResult(null)
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No encontrado: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (producto) => {
    setEditForm({
      cod: producto.cod,
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio_de_compra: producto.precio_de_compra,
      precio_de_venta: producto.precio_de_venta,
      stock: producto.stock,
      proveedor: producto.proveedor,
      estado: producto.estado,
    })
    // Do NOT change theme when selecting a product
  }

  const productOptions = useMemo(
    () => productos.map((p) => ({ value: String(p.cod), label: `#${p.cod} - ${p.nombre}` })),
    [productos],
  )

  const handleProductoSelect = (option) => {
    if (!option) {
      setEditForm({ ...emptyForm, cod: '' })
      // keep current theme when clearing selection
      return
    }
    const selectedId = Number(option.value)
    const selectedProducto = productos.find((item) => item.cod === selectedId)
    if (selectedProducto) {
      startEdit(selectedProducto)
    }
  }

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      background: isDark ? 'rgba(8,10,12,0.72)' : '#ffffff',
      borderRadius: 12,
      borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)',
      paddingLeft: 6,
      boxShadow: 'none',
    }),
    singleValue: (provided) => ({ ...provided, color: isDark ? '#fff' : '#0f172a' }),
    menu: (provided) => ({
      ...provided,
      background: isDark ? 'rgba(8,10,12,0.92)' : '#ffffff',
      color: isDark ? '#fff' : '#0f172a',
      borderRadius: 8,
      overflow: 'hidden',
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused
        ? isDark
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(0,0,0,0.04)'
        : 'transparent',
      color: isDark ? '#fff' : '#0f172a',
    }),
  }

  return (
    <>
      <Header isDark={isDark} setIsDark={setIsDark} />

      <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Beauty Data Console</p>
          <h1>Control de inventario con estilo y datos en vivo.</h1>
          <p className="subtitle">
            Conectado a la API de FastAPI para crear, editar y revisar productos sin
            salir del navegador.
          </p>
        </div>
        <div className="hero-card">
          <div>
            <span>Total productos</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span>Stock total</span>
            <strong>{stats.stock}</strong>
          </div>
          <div>
            <span>Margen medio</span>
            <strong>${stats.margen.toFixed(2)}</strong>
          </div>
        </div>
      </header>

      {/* Alerts (success / error) */}
      {status.type === 'success' && (
        <AlertSuccess
          message={status.message}
          onClose={() => setStatus({ type: 'idle', message: '' })}
        />
      )}
      {status.type === 'error' && (
        <AlertError
          message={status.message}
          onClose={() => setStatus({ type: 'idle', message: '' })}
        />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Eliminar producto"
        message="¿Deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete(null)}
        loading={confirmLoading}
      />

      <div className="status-bar" data-type={status.type}>
        <span>{status.message || 'Listo para sincronizar.'}</span>
        <button type="button" onClick={loadProductos} disabled={loading}>
          {loading ? 'Cargando...' : 'Refrescar'}
        </button>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="content">
        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
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
                          <button type="button" onClick={() => {
                            startEdit(producto);
                            setActiveTab('edit');
                          }}>
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
        )}

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <Panel>
            <div className="panel-header">
              <h2>Nuevo producto</h2>
              <p>Registra un producto nuevo en segundos.</p>
            </div>
            <form className="form" onSubmit={handleCreate}>
              <div className="field">
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
              <button type="submit" disabled={loading}>
                Guardar producto
              </button>
            </form>
          </Panel>
        )}

        {/* EDIT TAB */}
        {activeTab === 'edit' && (
          <Panel>
            <div className="panel-header">
              <h2>Editar producto</h2>
              <p>Selecciona un producto de la tabla inventario para editarlo.</p>
            </div>
            <form className="form" onSubmit={handleEditSubmit}>
              <div className="field">
                <label>Producto</label>
                <Select
                  styles={selectStyles}
                  classNamePrefix="react-select"
                  options={productOptions}
                  value={productOptions.find((o) => Number(o.value) === Number(editForm.cod)) || null}
                  onChange={handleProductoSelect}
                  isClearable
                  placeholder="Selecciona uno"
                />
              </div>
              <div className="field">
                <label>Nombre</label>
                <input
                  value={editForm.nombre}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, nombre: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label>Categoria</label>
                <input
                  value={editForm.categoria}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, categoria: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label>Descripcion</label>
                <input
                  value={editForm.descripcion}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, descripcion: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label>Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.precio_de_compra}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        precio_de_compra: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label>Venta</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.precio_de_venta}
                    onChange={(event) =>
                      setEditForm((prev) => ({
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
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, stock: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label>Proveedor</label>
                  <input
                    value={editForm.proveedor}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, proveedor: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label>Estado</label>
                <select
                  value={editForm.estado}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, estado: event.target.value }))
                  }
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <button type="submit" disabled={loading}>
                Guardar cambios
              </button>
            </form>
          </Panel>
        )}
      </main>

      <footer className="footer">
        <p>API conectada en {API_BASE}</p>
      </footer>
      </div>
    </>
  )
}

export default App
