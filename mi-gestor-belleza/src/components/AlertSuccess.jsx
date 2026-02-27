import React from 'react'

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
