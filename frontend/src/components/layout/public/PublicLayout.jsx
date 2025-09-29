import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <>
        {/* Contiene la nav */}
        <Header/>

        {/* Contenido ppal publico */}
        <section className="layout__content">
          <Outlet />

        </section>

    </>

  )
}
