import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Panel from './components/Panel'
import AlertSuccess from './components/AlertSuccess'
import AlertError from './components/AlertError'
import ConfirmDialog from './components/ConfirmDialog'
import Inventory from './pages/Inventory'
import Create from './pages/Create'
import Edit from './pages/Edit'

/*
  App.jsx - componente principal
  - Gestiona llamadas a la API para productos (CRUD).
  - Mantiene el estado de la aplicación (carga, formularios, mensajes).
  - Renderiza la cabecera, las rutas y las páginas de la aplicación.
*/

// Dirección base de la API. Se puede cambiar con la variable de entorno VITE_API_URL.
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Instancia de axios con la URL base y cabeceras JSON.
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Plantilla para un formulario vacío usado al crear o editar productos
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
  // --- Declaración de estados del componente ---
  // `productos`: lista de productos obtenida desde la API
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  // `status` guarda mensajes visibles para el usuario
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [createForm, setCreateForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState({ ...emptyForm, cod: '' })
  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)
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
    // Fetch list of products on initial mount
    loadProductos()
  }, [])

  const navigate = useNavigate()

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

  // Convierte datos del formulario a tipos correctos antes de enviar a la API
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

  // Crea un producto en la API y actualiza la lista local
  const handleCreate = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload = normalizePayload(createForm)
      const response = await api.post('/productos', payload)
      setProductos((prev) => [response.data, ...prev])
      setCreateForm(emptyForm)
      // After create, open edit view for the created product
      startEdit(response.data)
      navigate(`/edit/${response.data.cod}`)
      setMessage('success', 'Producto creado.')
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No se pudo crear: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Envía los cambios de un producto existente a la API
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

  // Abre un diálogo para confirmar eliminación
  const handleDelete = (productoId) => {
    setConfirmDelete(productoId)
  }

  // Ejecuta la eliminación en la API una vez confirmado
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

  // Busca un producto por ID y guarda el resultado
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

  const goToEdit = (producto) => {
    startEdit(producto)
    navigate(`/edit/${producto.cod}`)
  }

  const fetchAndStartEdit = async (id) => {
    if (!id) return
    setLoading(true)
    try {
      const response = await api.get(`/productos/${id}`)
      startEdit(response.data)
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
      setMessage('error', `No se pudo cargar producto: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
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
      <Tabs />

      <main className="content">
        <Routes>
          <Route
            path="/"
            element={
              <Inventory
                productos={productos}
                loading={loading}
                searchId={searchId}
                setSearchId={setSearchId}
                searchResult={searchResult}
                handleSearch={handleSearch}
                handleDelete={handleDelete}
                onStartEdit={goToEdit}
              />
            }
          />
          <Route
            path="/create"
            element={<Create createForm={createForm} setCreateForm={setCreateForm} handleCreate={handleCreate} loading={loading} />}
          />
          <Route
            path="/edit/:id?"
            element={
              <Edit
                editForm={editForm}
                setEditForm={setEditForm}
                handleEditSubmit={handleEditSubmit}
                loading={loading}
                productos={productos}
                productOptions={productOptions}
                handleProductoSelect={handleProductoSelect}
                fetchAndStartEdit={fetchAndStartEdit}
              />
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <p>API conectada en {API_BASE}</p>
      </footer>
      </div>
    </>
  )
}

export default App
