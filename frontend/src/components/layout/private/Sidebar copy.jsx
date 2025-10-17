/*
    COMPONENTE CON LA SIDEBAR:
        - Muestra información del usuario logado: 
        
            - Avatar
            - nick
            - Nombre del usuario
            - Enlaces con contadores de las personas que sigue, le siguen y sus publicaciones                

        - Un formulario para realizar una nueva publicación y de forma opcional podrá subir una fotografía

*/
import React, { useState, useRef } from 'react';
import avatar from './../../../assets/img/user.png';
import useAuth from '../../../hooks/useAuth';
import { GLOBAL } from '../../../helpers/global';
import { Link} from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

// Componente
export const Sidebar = () => {

    // Obtengo la información del usuario y los contadores de siguiendo, seguidores y publicaciones desde el contexto
    const {auth , counters} = useAuth(); 
    
    // Obtengo el token de localstorage
    const token = localStorage.getItem('token');

    // Uso este hook para obtener los datos del formulario
    const {form, changed, resetForm} = useForm({});

    // Estado que contendrá si envio o no la publicacion
    const [publicationState, setPublicationState] = useState('not_saved');

    // Estado para tener control sobre cuando seleccione el archivo de publicación
    const [fileSelected, setFileSelected] = useState(null); 

    // Declaración de useRef para la referencia al input de tipo fichero del formulario
    const fileInputRef = useRef(null);
    
    // Función que recoge los datos del formulario y guarda la publicación con o sin imagen
    const savePublication =  async (e) => {        
        e.preventDefault();   
            
        // Reinicio el estado al inicio de cada intento
        setPublicationState("not_saved"); 
    
        // Creo una vble que almacenará el estado con los datos de la publicación
        let publication = form;
    
        // Realizo la petición al backend
        try {

            // Guardo los datos de la publicación
            const request = await fetch(GLOBAL.url + 'publication/save', {
                method: "POST",
                body: JSON.stringify(publication),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
    
            // Recogo los datos de la consulta y los hago legibles
            const data = await request.json();                       

            // Si obtuve respuesta correcta.Veo si seleccionó un archivo y lo subo.
            // Si hay error muestro lo que me devuelve el error del backend
            if (data.status === "success") {

                // La publicación ya está hecha
                setPublicationState('saved');

                // Si se seleccionó un fichero lo añado
                if (fileSelected) {

                    // Obtengo el ID de la publicación recién creada a partir del backend
                    const publicationId = data.publication_saved._id;
                    
                    // Creo una instancia de formulario
                    const formData = new FormData();

                    // Le añado file0 porque así lo espera el backend y le adjunto el fichero a la instancia de formulario
                    formData.append('file0', fileSelected); 
                    
                    // Hago la petición al backend
                    try {
                    
                        // Pido añadir la imagen
                        const uploadRequest = await fetch(GLOBAL.url + 'publication/upload/'+ publicationId, {
                            method: "POST",
                            body: formData,
                            headers: {                            
                                "Authorization": token
                            }
                        });
                
                        // Recogo los datos de la consulta y los hago legibles
                        const uploadData = await uploadRequest.json();  
                        
                
                    } catch (error) {

                        // Fallo de red (servidor apagado) o error de parseo.
                        console.error("Error en la petición o red:", error);                        
                    }
                    
                }

            } else {   

                // Muestro los errores devueltos por el servidor             
                console.log(data);
               
            }

            // Reseto el formulario
            if (data.status === "success") {
            
                // 1. Resetear los campos de texto
                resetForm(); 

                // 2. Resetear el estado de la imagen
                setFileSelected(null);
                
                // 3. Resetear el input file usando la referencia DOM
                if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.value = ""; 
                }
            }
    
        } catch (error) {    
            // Fallo de red (servidor apagado) o error de parseo.
            console.error("Error en la petición o red:", error);
            setPublicationState('error');
        } 
        
    }

    // Renderizo el aside
    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    {/* Información del usuario */}
                    <div className="profile-info__general-info">
                        
                        <div className="general-info__container-avatar">

                            {/* Si hay imagen para el avatar la muestra si no muestra el avatar por defecto */}
                            {auth.image && auth.image !== "default.png" ?
                                <img 
                                    src={GLOBAL.url + 'user/avatar/' + auth.image}
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
                            <Link
                                to={"/social/profile/" + auth._id}
                                className="container-names__name">{auth.name} {auth.surname}
                                <p className="container-names__nickname">{auth.nick}</p>
                            </Link>
                            
                        </div>

                    </div>

                    {/* Contadores de personas que sigue, personas que le siguen y publicaciones del usuario logado */}
                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to="/social/following" className="following__link">
                                <span className="following__title">Siguiendo</span>
                                <span className="following__number">{counters.following}</span>
                            </Link>
                        </div>

                        <div className="stats__following">
                            <Link to = '/social/followers' className="following__link">
                                <span className="following__title">Seguidores</span>
                                <span className="following__number">{counters.followers}</span>
                            </Link>
                        </div>

                        <div className="stats__following">
                            <Link to={"/social/profile/" + auth._id} className="following__link">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{counters.publications}</span>
                            </Link>
                        </div>

                    </div>

                </div>

                {/* Formulario para añadir una publicación*/}
                <div className="aside__container-form">

                    <form className="container-form__form-post" onSubmit={savePublication}>

                        <div className="form-post__inputs">
                            <label htmlFor="post" className="form-post__label">¿Que estas pensando hoy?</label>
                            <textarea
                                name="text"
                                className="form-post__textarea"

                                // ✅ Enlaza el valor del textarea con el estado del formulario
                                value={form.text || ''}                                 
                                
                                onChange={changed}
                            >   
                            </textarea>
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="image" className="form-post__label">Sube tu foto</label>
                            <input
                                type="file"
                                name="image"
                                id='file'
                                className="form-post__image"  
                                ref={fileInputRef}
                                

                                // Actualizo el estado cuando selecione un archivo
                                onChange={(e) => setFileSelected(e.target.files[0])}
                            />
                        </div>

                        <input type="submit" value="Enviar" className="form-post__btn-submit" />

                    </form>

                    {/* Resultado del proceso de la publicación */}
                    <div className='alert'>
                        {publicationState=='saved' ? <strong className='alert-success'>Publicación correcta</strong> : ''}
                        {publicationState=='error' ? <strong className='alert-danger'>Error en la publicación</strong>: ''}
                    </div>                    

                </div>

            </div>

        </aside>
    )
    
}
