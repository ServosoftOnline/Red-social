// src/context/AuthProvider.js

import React, { useState, createContext, useEffect } from 'react';
import { GLOBAL } from '../helpers/global';

// 1. Creo el contexto
const AuthContext = createContext();

// 2. Exporto el provider
export const AuthProvider = ({children}) => {
    
    // Estados para almacenar la información del usuario logado
    const [auth, setAuth] = useState({});

    // Estado para los contadores de following, followers y publications
    const [counters, setCounters] = useState({});

    // Estado para controlar mientras se estan cargando componentes
    const [loading, setLoading] = useState(true);

    // Ejecuta la función authUser cada vez que cargue el componente
    useEffect(() => {
        authUser();
    },[]);

    // Función que comprueba si el usuario tiene token
    const authUser = async () => {

        // Obtiene datos del usuario identificado del localstorage como un json
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        // Comprobar si tengo el token y el user. Si no lo tengo, indico que acabo de cargar y salgo
        if(!token || !user) {
            setLoading(false);
            return false;
        }

        // Transformar los datos de json a un objeto de javascript y obtengo el id del usuario
        const userObj = JSON.parse(user);
        const userId = userObj.id;        

        // Primera petición ajax al backend para que compruebe el token y que devuelva los datos del usuario        
        const requestDataUser = await fetch(GLOBAL.url + 'user/profile/' + userId, {
            method: "GET",                
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        // Recogo los datos de la consulta sobre los datos del usuario y los hago legibles
        const dataUser = await requestDataUser.json();

        // Setear el estado de auth
        setAuth(dataUser.user);

        // Segunda petición al ajax para obtener los numeros de a quienes sigue, quienes le siguen y sus publicaciones
        const requestCounters = await fetch(GLOBAL.url + 'user/counters/' + userId, {
            method: "GET",                
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        // Recogo los datos de la consulta sobre los datos del usuario y los hago legibles
        const dataCounters = await requestCounters.json();

        // Setear el estado de counters
        setCounters(dataCounters);

        // Setear cargando. Cuando se actualizen los anteriores estados ya acabé de cargar        
        setLoading(false);

    }

    // El objeto que pasamos a "value" para compartirlo
    const contextValue = {
        auth, 
        setAuth,
        counters,
        setCounters,
        loading    
    };

    // Devuelvo la información que contiene el objeto contextValue que compartiré entre mis hijos
    return (        
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// Exporto el contexto
export default AuthContext;
