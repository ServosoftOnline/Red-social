// Importar dependencias
import { connection } from "./database/connection.js";
import express from 'express';
import cors from 'cors';

// Conexión a la bbdd
connection();

// Crear servidor node
const app = express();
const puerto = process.env.PORT || 3900;

// Configurar cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json()); // Recibe datos con content-type app/json
app.use(express.urlencoded({extended:true})); // recibe datos form-urlencoded

// Cargar conf rutas
app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'API REST con nodejs de una red social'
    })    
});

// Importo todas las rutas 
import userRoutes from './routes/user.js';
import publicationRoutes from "./routes/publication.js";
import followRoutes from "./routes/follow.js";

// Añado el prefijo /api/ a las rutas
app.use("/api/", userRoutes);
app.use("/api/", publicationRoutes);
app.use("/api/", followRoutes);

// Poner servidor a escuchar
app.listen(puerto,() => {
    console.log('Servidor corriendo en el puerto ' + puerto);
});