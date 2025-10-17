/*
    COMPONENTE QUE MUESTRA LA LISTA DE PUBLICACIONES
        - Este componente lo usan los componentes Profile y Feed
            - Profile muestra las publicaciones del usuario logado
            - Feed muestra las publicaciones de los seguidores del usuario logado

*/
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import avatar from './../../assets/img/user.png';
import { GLOBAL } from '../../helpers/global';
import { fechaFormateada, tiempoRelativo } from "../../helpers/Fechas";
import useAuth from '../../hooks/useAuth';

// Componente
export const PublicationsList = ({publications, getPublications, getCounters, hasMore}) => {

    // Estado que almacena la pagina que se muestra
    const [page, setPage] = useState(1);

    // Obtengo el id del usuario logado
    const {auth} = useAuth();
    const authUser_id = auth._id;

    // Obtengo el id del usuario pasado como parámetro
    const params = useParams();    
    const userId = params.userId;

    // Función que aumenta el número de la pagina y obtiene las publicaciones de la pagina siguiente
    const showNextPage = () => {        
        let nextPage = page + 1;
        setPage(nextPage);
        getPublications(nextPage);
    } 

    // Función que elimina una publicación
    const deletePublication = async (publicationId) => {        
        
        try {

            // Petición para eliminar la publicación
            const request = await fetch(GLOBAL.url + 'publication/erase/' + publicationId, {
                method: "DELETE",        
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem('token')
                }
            });

            // Obtengo los resultados de la petición y los hago legibles
            const data = await request.json();            

            // Si hubo exito al eliminar, reinicio los contadores y las publicaciones
            if (data.status == "success") {                            
                getCounters();
                getPublications();
            }

        } catch (error) {
            console.error("Error en la petición o red:", error);
        } 

    }

    // Renderizo
    return (
        <>
            {/* Contenido de las publicaciones */}
            {/* Si hay al menos una publicacion la muestro y si no indicamos que no hay publicaciones */}
            {publications.length > 0 ? (
                
                publications.map((publication) => {

                    return(
                        <article className="content__posts" key={publication._id}>

                            <div className="posts__post">

                                <div className="post__container">

                                    {/* Si hay imagen para el avatar la muestra si no muestra el avatar por defecto */}
                                    <div className="post__image-user">
                                        
                                        {publication.user.image && publication.user.image !== "default.png" ?
                                            <img 
                                                src={GLOBAL.url + 'user/avatar/' + publication.user.image} 
                                                className="post__user-image"
                                                alt="Foto de perfil" 
                                            />
                                            :
                                            <img 
                                                src={avatar}
                                                className="post__user-image"
                                                alt="Foto de perfil" 
                                            />
                                        }
                                        
                                    </div>

                                    <div className="post__body">

                                        {/* publicacion */}
                                        <div className="post__user-info">
                                            
                                            <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                                            <span className="user-info__divider"> | </span>
                                            <a href="#" 
                                                className="user-info__create-date">
                                                {fechaFormateada(publication.created_at)} -{" "}
                                                {tiempoRelativo(publication.created_at)}
                                            </a>
                                        </div>

                                        <h4 className="post__content">{publication.text}</h4>

                                        {/* Si existiera imagen en la publicación la muestro */}
                                        {publication.file &&                                        
                                            <img src={GLOBAL.url + 'publication/media/' + publication.file}/>
                                        }

                                    </div>

                                </div>                                
                                
                                {/* Botón temporal. Solo el usuario logado verá este boton */}
                                {authUser_id == userId &&
                                    <div className="post__buttons">
                                        <button
                                            className="post__button--icon"
                                            onClick={()=>{deletePublication(publication._id)}}
                                        >
                                            -
                                        </button>                                       
                                    </div>
                                }

                                {/* El botón final tendría este aspecto con un icono de font awesome */}
                                {/* <div className="post__buttons">
                                    <a href="#" className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </a>
                                </div> */}
                                

                            </div>

                        </article>
                    )
                })
                
            ) : ( 
                // No hay publicaciones
                <article className="content__posts">
                    <div className="posts__post">
                        <h2>El usuario no tiene publicación aún</h2>
                    </div>
                </article>
            )}


            {/* Botón ver mas publicaciones solo si hubiera mas publicaciones*/}  
            {hasMore &&
                <div className="content__container-btn">
                    <button
                        className="content__btn-more-post"
                        onClick={()=> showNextPage()}
                    >
                        Ver mas publicaciones
                    </button>
                </div>
            }          
        </>
    );
        
}
