import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link} from "react-router-dom";
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Login } from '../components/user/Login';
import { Register } from '../components/user/Register';
import { Feed } from '../components/publication/Feed';

export const Routing = () => {
    return (
        <BrowserRouter>
      
            <Routes>

                {/* Grupo de rutas para la parte publica. Todas las rutas que empiezen por / serán públicas */}
                <Route path="/" element={<PublicLayout />}>                    
                    <Route index element={<Login />} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                </Route> 

                {/* Grupo de rutas para la parte privada */}
                <Route path="/social" element={<PrivateLayout />}>
                    <Route index element={<Feed />} />
                    <Route path='feed' element={<Feed />} />                    
                </Route> 
                
                {/* Ruta 404 */}
                <Route path='*' element={   
                    <>
                        <p>
                            <h2>Error 404. Página no encontrada</h2>   
                            <Link to='/'>Ir al inicio</Link>                 
                        </p>

                    </>                 
                } />

            </Routes>

        </BrowserRouter>
  )
}
