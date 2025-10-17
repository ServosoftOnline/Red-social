// HOOK PARA OBTENER LA INFORMACIÓN PROVENIENTE DE UN FORMULARIO (REVISAR EL COMENTARIO)

import React, { useState } from 'react'

// Función cuyo parámetro inicial es un objeto inicial que estará vacio
export const useForm = (initialObj = {}) => {

    // Estado cuyo valor inicial será el objeto inicial obtenido como parámetro
    const [form, setForm] = useState(initialObj);

    // recibe los tarjet y creo un objeto completo con todos los valores introducidos
    const changed = ({target}) => {

        // Desextructuro el tarjet para obtener los valores name y value
        const {name, value} = target;

        // Voy actualizando el contenido del estado form con el contenido que tuviera más el conjunto clave-valor de los cambios
        setForm({
            ...form,
            [name]: value
        });

    }

    // Función que resetea el formulario al estado inicial
    const resetForm = () => {
        setForm(initialObj);
    }

    // Devuelvo el objeto
    return {
        form,
        changed,
        resetForm
    }
}
