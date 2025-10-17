import React from 'react'
import { GLOBAL } from "./global";

// Función
export const unFollow = async (e, id, setState) => {
    e.preventDefault();    

    try {

        // Petición para guardar el follow    
        const request = await fetch(GLOBAL.url + 'follow/delete/' + id, {
            method: "DELETE",        
            headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token')
            }
        });

        // Obtengo los resultados de la consulta y los hago legibles
        const data = await request.json();

        // Si me devuelve exito la consulta elimino el id pasado como parámetro al array con los id de los following
        if (data.status === "success") {
            setState(prevState => prevState.filter(followId => followId !== id));
        }

    } catch (error) {
        console.error("Error en la petición o red:", error);
    } 
}
