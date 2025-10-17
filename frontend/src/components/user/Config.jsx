/*
    FORMULARIO PARA EDITAR LOS DATOS DEL USUARIO LOGADO
        - Obtengo la información del usuario logado
        - Lo añado al formulario mediante defaultValue

*/
import React, {useState } from 'react';
import { GLOBAL } from '../../helpers/global';
import useAuth from '../../hooks/useAuth';
import avatar from './../../assets/img/user.png';
import { serializeForm } from '../../helpers/serializeForm';

export const Config = () => {

    // Obtengo los datos del usuario logado
    const {auth, setAuth} = useAuth();       

    // Estado que almacenará si se editó o no de forma correcta el usuario
    const [edited, setEdited] = useState("not_edited");

    // Estado que almacenará el mensaje de error específico del backend
    const [errorMessage, setErrorMessage] = useState(null); 

    // Creo una cte con el token
    const token = localStorage.getItem('token');

    // Función que recoge los datos del formulario y los actualiza
    const updateUser = async (e) => {
        e.preventDefault();

        // Limpiar mensajes de error anteriores antes de una nueva petición
        setErrorMessage(null); 

        // Serializo el formulario
        let newDataUser = serializeForm(e.target);        

        // Le elimino la información del fichero porque no la necesito
        delete newDataUser.file0;

        // Actualizar usuario en la bbdd
        try {
        
            // Actualizo al usuario con la nueva información y la autorización la cojo de localstorage
            const request = await fetch(GLOBAL.url + 'user/update', {
                method: "PUT",
                body: JSON.stringify(newDataUser),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
    
            // Recogo los datos de la consulta y los hago legibles
            const data = await request.json();            
    
            // Actualizo estados de la sesión y si fue editado o se produjo un error al editar
            if (request.ok) {

                // Actualizo la información de la sesión con los nuevos datos
                setAuth(data.user);

                // Actualizo los datos el estado edited
                setEdited('edited');
    
            } else {

                // Actualizo los estados de error que viene del backend y del resultado de la edición
                if (data.message) setErrorMessage(data.message);
                else setErrorMessage("Error desconocido al actualizar datos.");
                
                setEdited('error');
                
            }

            // SUBO EL AVATAR
            // Obtengo del DOM el id llamado file
            const fileInput = document.querySelector('#file');

            // Si obtuve un status de ok de la petición y existe un fichero seleccionado en el formulario
            if(request.ok && fileInput.files[0]) {

                // Creo una instancia de formulario y le adjunto el fichero
                const formData = new FormData();
                formData.append('file0', fileInput.files[0]);                

                // Petición para añadir la imagen
                try {

                    const uploadRequest = await fetch(GLOBAL.url + 'user/upload', {
                        method: "POST",
                        body: formData,
                        headers: {                            
                            "Authorization": token
                        }
                    });

                    // Recogo los datos de la consulta y los hago legibles
                    const uploadData = await uploadRequest.json();                    

                    // Actualizo estados
                    if (uploadRequest.ok) {         

                        setAuth(uploadData.userUpdated);
                        setEdited('edited');
            
                    } else {
                        setEdited('error');
                    }

                } catch (error) {

                    // Fallo de red (servidor apagado) o error de parseo.
                    console.error("Error en la petición o red:", error);
                    setEdited('error');
                }
            }

    
        } catch (error) {

            // Fallo de red (servidor apagado) o error de parseo.
            console.error("Error en la petición o red:", error);
            setEdited('error');
        }
        
        
    }

    // Renderizo
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Ajustes</h1>        
            </header>

            <div className="content__posts">        

                {/* formulario */}            
                <form className='config-form' onSubmit={updateUser}>

                <div className='form-group'>
                    <label htmlFor='name'>Nombre</label>
                    <input
                        type='text'
                        name='name'  
                        defaultValue={auth.name}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='surname'>Apellidos</label>
                    <input
                        type='text'
                        name='surname'          
                        defaultValue={auth.surname}    
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='bio'>Bio</label>
                    <textarea 
                        name='bio'
                        defaultValue={auth.bio}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='nick'>Nick</label>
                    <input
                        type='text'
                        name='nick'   
                        defaultValue={auth.nick}           
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='email'>Correo electrónico</label>
                    <input
                        type='email'
                        name='email' 
                        defaultValue={auth.email}             
                    />
                </div>

                <div className='form-group'>

                    <label htmlFor='file0'>Avatar</label>
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
                    
                    <input
                        type='file'
                        name='file0'
                        id='file'              
                    />

                </div>

                <input type='submit' value="Actualizar" className='btn btn-success' />

                </form>

            </div>

            {/* Resultado del proceso de registro */}
            {edited=='edited' ? <strong className='alert-success'>Edición correcta de los datos</strong>: ''}
            {edited=='error' ? <strong className='alert-danger'>Error al editar al usuario : {errorMessage}</strong>: ''}
            
        </>
    )
}
