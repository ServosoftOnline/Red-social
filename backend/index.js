// Importar dependencias
import { connection } from "./database/connection.js";
import express from 'express';
import cors from 'cors';

// Importa el módulo 'path' para trabajar con rutas de archivos
import path from 'path'; 

// Importo para dotenv para poder cargar las variables de entorno
import 'dotenv/config';

// Establezco la conexión con la bbdd
connection();

// Crear servidor node
const app = express();
const puerto = process.env.PORT || 3900;

// Configuro cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json()); // Recibe datos con content-type app/json
app.use(express.urlencoded({extended:true})); // recibe datos form-urlencoded

// -----------------------------------------------------------------------------------
// Servir archivos estáticos de forma unificada
// Usamos una sola línea para servir toda la carpeta 'img' y sus subcarpetas
const imagesPath = path.resolve('./img');
app.use('/uploads', express.static(imagesPath));
// -----------------------------------------------------------------------------------



// Ruta al directorio raiz
app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'API REST con nodejs de una red social'
    })    
});

// Importo todas las rutas 
import userRoutes from './routes/user.js';
import followRoutes from "./routes/follow.js";
import publicationRoutes from "./routes/publication.js";

// Añado el prefijo /api/ a las rutas
app.use("/api/user", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/publication", publicationRoutes);


// Poner servidor a escuchar
app.listen(puerto,() => {
    console.log('Servidor corriendo en el puerto ' + puerto);
});