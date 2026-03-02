import React from 'react'

// Componente para pedir confirmación antes de acciones destructivas
// Muestra un modal con título, mensaje y botones de confirmar/cancelar
export default function ConfirmDialog({ open, title = 'Confirmar', message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" onClick={onCancel} className="btn">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="btn danger" disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
