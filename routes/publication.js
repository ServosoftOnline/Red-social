// Asigno el metodo Router de express y creo las rutas de publication
import express from "express";
const publicationRoutes = express.Router();

// Importo los métodos del controlador
import  {pruebaPublication} from "./../controllers/publication.js";

// Establezco las rutas
publicationRoutes.get('/ruta-de-prueba-publication', pruebaPublication);

// Exporto las rutas de publication
export default publicationRoutes;