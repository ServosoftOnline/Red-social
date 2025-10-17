import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link} from "react-router-dom";
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Login } from '../components/user/Login';
import { Register } from '../components/user/Register';
import { Feed } from '../components/publication/Feed';
import { AuthProvider } from '../context/AuthProvider';
import { Logout } from '../components/user/Logout';
import { People } from '../components/user/People';
import { Config } from '../components/user/Config';
import { Following } from '../components/follow/Following';
import { Followers } from '../components/follow/Followers';
import { Profile } from '../components/user/Profile';

export const Routing = () => {
    return (
        <BrowserRouter>
        <AuthProvider>
      
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
                    <Route path='logout' element={<Logout />} />
                    <Route path='people' element={<People />} />
                    <Route path='config' element={<Config />} />
                    <Route path='following/:userId' element={<Following />} />
                    <Route path='followers/:userId' element={<Followers />} />
                    <Route path='profile/:userId' element={<Profile />} />
                    
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
            
        </AuthProvider>
        </BrowserRouter>
  )
}
