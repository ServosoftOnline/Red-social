// MODELO FOLLOWS

import { Schema, model } from "mongoose";  
import mongoosePaginate from 'mongoose-paginate-v2';            

// Esquema
const FollowSchema = Schema({

    // Guardarán la referencia al objeto cuya referencia es el modelo User
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    followed: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    
    // Guardará el momento actual
    created_at: {
        type: Date,
        default: Date.now
    }

});

// Añado el pluggin al esquema
FollowSchema.plugin(mongoosePaginate);

// Exporto el modelo (nombre del modelo, Schema, "coleccion opcional si no la pongo pluraliza" )
export default model("Follow", FollowSchema, "follows");