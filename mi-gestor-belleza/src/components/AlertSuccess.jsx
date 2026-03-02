import React from 'react'

// Componente para mostrar mensajes de éxito
// `message` es el texto a mostrar, `onClose` cierra la alerta si existe
export default function AlertSuccess({ message, onClose }) {
  if (!message) return null
  return (
    <div className="alert alert-success" role="status">
      <div className="alert-body">
        <strong>Éxito:</strong> {message}
      </div>
      {onClose ? (
        <button className="alert-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      ) : null}
    </div>
  )
}
