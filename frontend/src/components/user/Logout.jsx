// COMPONENTE PARA CERRAR SESIÓN Y REDIRIGIR A LOGIN

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Logout = () => {

    // Creo la cte para navegar
    const navigate = useNavigate();

    // Obtengo las funciones de los estados globales desde el contexto
    const {setAuth, setCounters} = useAuth();

    // Creo este efecto para que se ejecute nada mas se carge el componente
    useEffect(() => {

        // Vacia localstorage
        localStorage.clear();

        // Reinicia estados globales
        setAuth({});
        setCounters({});

        // Redirigo hacia login
        navigate('/login');

    },[]);

    // Renderizo
    return (
        <h2>Cerrando sesion ...</h2>
    )
}
