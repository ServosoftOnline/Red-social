// helpers/getProfile.js
import { GLOBAL } from "./global";

// La función ahora espera idUsuario y token como argumentos
export const getProfile = async (idUser, setState) => {

    try {
        // Usa los argumentos para construir la URL y los headers
        const requestDataUser = await fetch(GLOBAL.url + 'user/profile/' + idUser, {
            method: "GET",                
            headers: {
                "Content-Type": "application/json",                
                "Authorization": localStorage.getItem('token')
            }
        });

        const dataUser = await requestDataUser.json();        

        // Actualiza el estado pasado como parámetro almacenando la información del usuario
        if (dataUser.status === 'success') setState(dataUser.user);

        // Devuelvo el perfil del usuario
        return dataUser;


    } catch (error) {

        // Muestro el error en consola y devuelvo un objeto vacio
        console.error("Error en la red al obtener el perfil:", error);
        return {};
    }
};