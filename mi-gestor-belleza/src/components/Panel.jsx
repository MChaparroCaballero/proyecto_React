import React from 'react'

// Componente de contenedor para secciones de la UI
// Solo renderiza `children` dentro de un elemento con clase panel
export default function Panel({ children }) {
  return <section className="panel">{children}</section>
}
