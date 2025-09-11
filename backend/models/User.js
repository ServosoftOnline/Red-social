// MODELO USERS

import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';                

// Esquema
const UsersSchema = Schema({

    name: {
        type: String,
        required: true
    },

    surname: {
        type: String      
    },

    bio: {
        type: String      
    },

    nick: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "role_user"
    },

    image: {
        type: String,
        default: "default.png"      
    },
    
    created_at: {
        type: Date,
        default: Date.now
    }

});

// Añado el pluggin al esquema
UsersSchema.plugin(mongoosePaginate);

// Exporto el modelo (nombre del modelo, UsersSchema, "coleccion opcional si no la pongo pluraliza" )
export default model("User", UsersSchema, "users");