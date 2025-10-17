/*
    FUNCION QUE RECOGE UN FORMULARIO ENTERO Y DEVUELVE UN OBJETO CON SU CONTENIDO

        - Es exportable a otros proyectos, por eso lo creo como un helper
        - Lo pasaré como e.target
        - Creo una instancia de formulario
        - Creo un objeto vacio
        - Recorro la instancia y voy rellenando ese objeto:
            - La propiedad del objeto se corresponderá con el name del campo del formulario
            - El valor de esa propiedad se correponsdera con el value asociado al campo de ese formulario

        - Devuelvo el objeto
        

*/
import React from 'react'

export const serializeForm = (form) => {

    // Instancia
    const formData = new FormData(form);        

    // Objeto vacio
    const completeObj = {};

    // Recorro la instancia
    for(let[name, value] of formData) {
        completeObj[name] = value;
    }

    // Devuelvo el objeto
    return completeObj;
    
}
