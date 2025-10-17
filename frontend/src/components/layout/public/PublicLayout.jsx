/*
  COMPONENTE QUE CONTIENE LA CABECERA PUBLICA
    - Solo podré acceder a ella si no estuviera logado
*/

// Importaciones
import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

// Componente
export const PublicLayout = () => {

  // Obtengo los datos del usuario desde el contexto
  const {auth} = useAuth();  

  // Renderizo  
  return (
    <>
      {/* Cabecera que a su vez contiene la nav pública*/}
      <Header/>
      
      {/* 
        Si el usuario está logado lo redirigo hacia el contenido privado en caso contrario muestro el Outlet con el login y el registro
      */}

      <section className="layout__content">
          {auth._id ? <Navigate to='/social' /> : <Outlet />} 
      </section>

    </>
  )
}
