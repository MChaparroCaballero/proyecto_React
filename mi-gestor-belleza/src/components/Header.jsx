import React from 'react'

// Componente de cabecera
// Muestra el nombre de la app y el botón para cambiar tema
export default function Header({ isDark, setIsDark }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <span className="navbar-icon">💎</span>
          <span>BeautyData</span>
        </div>
      </div>
      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
