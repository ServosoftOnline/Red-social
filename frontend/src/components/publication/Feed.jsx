/*
    COMPONENTE QUE MUESTRA TODAS LAS PUBLICACIONES DE LOS USUARIOS QUE SIGUE EL USUARIO LOGADO
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicationsList } from '../user/PublicationsList';
import { GLOBAL } from '../../helpers/global';

// Componente
export const Feed = () => {

    // Obtengo el id pasado como parámetro
    const params = useParams();
    const userId = params.userId;

    // Obtengo el token de localstorage
    const token = localStorage.getItem('token');    

    // Estado que almacenará las publicaciones del usuario pasado como parámetro
    const [publications, setPublications] = useState([]);

    // Estado para saber si hay más páginas después de la actual
    const [hasMore, setHasMore] = useState(true);

    // Efecto que obtiene el perfil del usuario cuyo id fue pasado por parámetro, sus contadores y las primeras publicaciones
    useEffect(() => {        
        getPublications();
    }, [userId]);

    // Funcion que obtiene las publicaciones. Desde el backend las tengo limitadas de cinco en cinco
    // Si llamo a esta función sin pasarle ningún argumento, la variable page valdrá 1 por defecto.
    const getPublications = async (page = 1) => {        
        
        try {

            // Petición para guardar obtener la publicación del usuario
            const request = await fetch(GLOBAL.url + 'publication/feed/' + page, {
                method: "GET",        
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });

            // Obtengo los resultados de la consulta y los hago legibles
            const data = await request.json();               

            // Si me devuelve exito la consulta elimino el id pasado como parámetro al array con los id de los following
            if (data.status == "success" && data.docs) {            

                // Contactena las publicaciones excepto en la primera pagina. La primera pagina la cargaba dos veces
                // ME TUVO UNA MAÑANA ESTO. EL MODO STRICT LO CARGABA DOS VECES. DEJE EL MODO STRICT ACTIVO Y MODIFIQUE ESTA LÍNEA                
                setPublications(prev => page === 1 ? data.docs : [...prev, ...data.docs]);

                // Actualizo el estado hasMore con el resultado que me devuelve el pluggin de la paginación
                setHasMore(data.hasNextPage); 

            } else {

                // Ya no hay más páginas
                setHasMore(false);
            }

        } catch (error) {
            console.error("Error en la petición o red:", error);
        } 

    }

    // Renderizo
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button">Mostrar nuevas</button>
            </header>
            
            {/* Publicaciones. */}
            <PublicationsList
                publications = {publications}                
                getPublications = {getPublications}               
                hasMore= {hasMore}                              
            />
            
        </>
    )
}
