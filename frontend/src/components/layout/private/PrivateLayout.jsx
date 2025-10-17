/*
  COMPONENTE QUE CONTIENE LA CABECERA PRIVADA
    - Solo podré acceder a ella si estuviera logado
*/

import React from 'react'
import { Header } from './Header'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {

  // Obtengo la información del usuario y el estado cargando desde el contexto 
  const {auth, loading} = useAuth();

  // Renderizo
  return (
    <>
      {/* Header privada la cual contiene la nav privada */}
      <Header/>           
      
      {/*
        Sección ppal
        Si esta cargando muestra cargando publicaciones
        Si no está cargando y existe id de usuario carga el Outlet que contiene el contenido privado
        Si no está cargando y no existe id de usuario redirige hacia login
      */}
      <section className="layout__content">
        {loading ? <h2>Cargando publicaciones ....</h2> : auth._id ? <Outlet /> : <Navigate to='/login' />}   
      </section>

      {/* Igual que el anterior pero con la Barra Lateral */}
      {loading ? <h2>Cargando información del usuario ... </h2> : <Sidebar/>}  

    </>
  )
}
