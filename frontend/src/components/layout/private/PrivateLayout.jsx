import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const PrivateLayout = () => {
  return (
    <>
      {/* Contiene la nav */}
      <Header/>

      {/* Contenido ppal privado */}
      <section className="layout__content">
        <Outlet />
      </section>

      {/* Barra Lateral */}
      <Sidebar/>

    </>

  )
}
