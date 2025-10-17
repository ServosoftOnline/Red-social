/*
    COMPONENTE QUE MUESTRA EL PERFIL DE UN USUARIO

        - Si el usuario es el usuario logado, no mostrará ningun botón de seguir o dejar de seguir
        - Si no es el usuario logado y está siendo seguido por el usuario logado mostrará un botón para dejar de seguirlo
        - Si no es el usuario logado y no está siendo seguido por el usuario logado mostrará un botón para seguirlo
        - Muestra el nombre del usuario, su nick y un contador de personas que esta siguiendo, que le siguen y sus publicaciones
            - Estos contadores funcionan como link

        - En la parte inferior se muestran las publicaciones del usuario seleccionado
*/
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import avatar from './../../assets/img/user.png';
import useAuth from '../../hooks/useAuth';

// Componente
import { PublicationsList } from './PublicationsList';

// helpers
import { getProfile } from '../../helpers/getProfile';
import { GLOBAL } from '../../helpers/global';


// Componente
export const Profile = () => {

    // Obtengo el id del usuario logado
    const {auth} = useAuth();
    const authUser_id = auth._id;

    // Obtengo el id pasado como parámetro
    const params = useParams();
    const userId = params.userId;

    // Obtengo el token de localstorage
    const token = localStorage.getItem('token');

    // Estado que almacena el perfil del usuario
    const [profile, setProfile] = useState({});

    // Estado que contiene los contadores de following, followers y publications
    const [counters, setCounters] = useState({});

    // Estado para saber si el usuario logado sigue al usuario pasado como parámetro
    const [iFollow, setIFollow] = useState(false);

    // Estado que almacenará las publicaciones del usuario pasado como parámetro
    const [publications, setPublications] = useState([]);

    // Estado para saber si hay más páginas después de la actual
    const [hasMore, setHasMore] = useState(true);

    // Efecto que obtiene el perfil del usuario cuyo id fue pasado por parámetro, sus contadores y las primeras publicaciones
    useEffect(() => {

        // Función asincrona
        const fetchData = async () => {
            const profileData = await getProfile(userId, setProfile);

            if (profileData.status === 'success') {

                const userFollowed = profileData.followInfo?.following?.user;                
                setIFollow(!!userFollowed);
                
            }
        };

        // LLamo a la función asíncrona
        fetchData();

        // Inicio contadores y primeras publicaciones
        getCounters();
        getPublications();

    }, [userId]);

    // ------------------- FUNCIONES --------------------------------------

    // Función que obtiene los contadores de siguiendo, seguidores y publicaciones
    const getCounters = async () => {

        try {
            // Petición ajax para obtener los numeros de a quienes sigue, quienes le siguen y sus publicaciones
            const requestCounters = await fetch(GLOBAL.url + 'user/counters/' + userId, {
                method: "GET",                
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });

            // Recogo los datos de la consulta sobre los datos del usuario y los hago legibles
            const dataCounters = await requestCounters.json();

            // Setear el estado de counters si obtengo exito en la peticion
            if (dataCounters.status === 'success') setCounters(dataCounters);

        } catch (error) {
            console.error("Error al obtener los contadores: ", error);
        }
        
    }

    // Función para seguir a un usuario
    const follow =  async (id) => {        
          
        try {

            // Petición para guardar el follow    
            const request = await fetch(GLOBAL.url + 'follow/save', {
                method: "POST",
                body: JSON.stringify({followed: id}),
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                },
            });

            // Obtengo los resultados de la consulta y los hago legibles
            const data = await request.json();

            // Si me devuelve exito la consulta añado el id pasado como parámetro al array con los id de los following
            if (data.status === "success") {
                setIFollow(true);                
            }

        } catch (error) {
            console.error("Error en la petición o red:", error);
        } 
    }

    // Función para dejar de seguir a un usuario
    const unFollow = async (id) => {       

        try {

            // Petición para guardar el follow    
            const request = await fetch(GLOBAL.url + 'follow/delete/' + id, {
                method: "DELETE",        
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                }
            });

            // Obtengo los resultados de la consulta y los hago legibles
            const data = await request.json();

            // Si me devuelve exito la consulta elimino el id pasado como parámetro al array con los id de los following
            if (data.status === "success") {
                setIFollow(false);
                
            }

        } catch (error) {
            console.error("Error en la petición o red:", error);
        } 
    }

    // Funcion que obtiene las publicaciones. Desde el backend las tengo limitadas de cinco en cinco
    // Si llamo a esta función sin pasarle ningún argumento, la variable page valdrá 1 por defecto.
    const getPublications = async (page = 1) => {        
       
        try {

            // Petición para guardar obtener la publicación del usuario
            const request = await fetch(GLOBAL.url + 'publication/one-user/' + userId + '/' + page, {
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
    

    // --------------------------------  RENDERIZADO DEL COMPONENTE ----------------------------------
    return (
        <>

            <header className="aside__profile-info">

                {/* Datos generales del perfil */}
                <div className="profile-info__general-info">

                    <div className="general-info__container-avatar">

                        {/* Si hay imagen para el avatar la muestra si no muestra el avatar por defecto */}
                        {profile.image && profile.image !== "default.png" ?
                            <img 
                                src={GLOBAL.url + 'user/avatar/' + profile.image}
                                className="container-avatar__img"
                                alt="Foto de perfil" 
                            />
                            :
                            <img 
                                src={avatar}
                                className="container-avatar__img"
                                alt="Foto de perfil" 
                            />
                        }

                    </div>

                    <div className="general-info__container-names">

                        <div className="container-names__header">
                            <h2>{profile.name} {profile.surname}</h2>


                            {/* Solo mostraré el boton si no es el usuario logado.
                                Si no lo sigo muestro el botón de dejar de seguir
                                Si lo sigo muestro el boton de seguir*/}

                            {authUser_id !== profile._id && (
                                iFollow ? 

                                    <button
                                        className="post__button post__button--green"
                                        onClick={() => unFollow(userId)}
                                    >
                                        Dejar de seguir
                                    </button>
                                : 
                                    <button
                                        className="post__button post__button--red"
                                        onClick={() => follow(userId)}
                                    >
                                        Seguir
                                    </button>
                                
                            )}
                            
                        </div>
                        
                        <h2 className="container-names__nickname">{profile.nick}</h2>
                        <p>{profile.bio}</p>
                        
                    </div>
                    
                </div>

                {/* Contadores de siguiendo, seguidores y publicaciones */}
                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/following/" + profile._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following}</span>
                        </Link>
                    </div>

                    <div className="stats__following">
                        <Link to = {'/social/followers/' + profile._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followers}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={'/social/profile/' + profile._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications}</span>
                        </Link>
                    </div>

                </div>

            </header>

            {/* Publicaciones. */}
            <PublicationsList
                publications = {publications}                
                getPublications = {getPublications}
                getCounters = {getCounters}
                hasMore= {hasMore}                       
            />
            
        </>
    )
}
