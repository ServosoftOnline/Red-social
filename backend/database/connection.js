import mongoose from "mongoose";

// Función de conexión a la bbdd
export const connection = async() => {

    try {
        await mongoose.connect('mongodb://localhost:27017/red_social');
        console.log('Contectado localmente a la bbdd: red_social')

    } catch (error) {
        console.log(error);
        throw new Error ('No se ha podido conectar a la bbdd');
    }

}