import React from 'react'

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <nav className="tabs">
      <button
        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        📦 Inventario
      </button>
      <button
        className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
        onClick={() => setActiveTab('create')}
      >
        ➕ Nuevo Producto
      </button>
      <button
        className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
        onClick={() => setActiveTab('edit')}
      >
        ✏️ Editar Producto
      </button>
    </nav>
  )
}
