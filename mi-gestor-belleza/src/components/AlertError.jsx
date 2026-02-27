import React from 'react'

export default function AlertError({ message, onClose }) {
  if (!message) return null
  return (
    <div className="alert alert-error" role="alert">
      <div className="alert-body">
        <strong>Error:</strong> {message}
      </div>
      {onClose ? (
        <button className="alert-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      ) : null}
    </div>
  )
}
