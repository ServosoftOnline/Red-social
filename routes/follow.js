// Asigno el metodo Router de express y creo las rutas de follow
import express from "express";
const followRoutes = express.Router();

// Importo los métodos del controlador
import  {pruebaFollow} from "./../controllers/follow.js";

// Establezco las rutas
followRoutes.get('/ruta-de-prueba-follow', pruebaFollow);

// Exporto las rutas de follow
export default followRoutes;