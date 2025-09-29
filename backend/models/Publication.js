// MODELO PUBLICATIONS

import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';                

// Esquema
const PublicationSchema = Schema({

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    text: {
        type: String,
        required: true
    },

    file: String,

    created_at: {
        type: Date,
        default: Date.now
    }    

});

// Añado el pluggin al esquema
PublicationSchema.plugin(mongoosePaginate);

// Exporto el modelo (nombre del modelo, Schema, "coleccion opcional si no la pongo pluraliza" )
export default model("Publication", PublicationSchema, "publications");