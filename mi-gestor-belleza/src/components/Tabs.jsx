import React from 'react'
import { NavLink } from 'react-router-dom'

// Componente de navegación en la parte superior
// Usa enlaces de react-router para cambiar de vista sin recargar
export default function Tabs() {
  return (
    <nav className="tabs">
      <NavLink to="/" end className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>
        📦 Inventario
      </NavLink>
      <NavLink to="/create" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>
        ➕ Nuevo Producto
      </NavLink>
      <NavLink to="/edit" className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}>
        ✏️ Editar Producto
      </NavLink>
    </nav>
  )
}
