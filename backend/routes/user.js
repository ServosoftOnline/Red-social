// Asigno el metodo Router de express y creo las rutas de user
import express from "express";
const userRoutes = express.Router();

// Importo los métodos del controlador
import  {pruebaUser} from "./../controllers/user.js";

// Establezco las rutas
userRoutes.get('/ruta-de-prueba-user', pruebaUser);

// Exporto las rutas de user
export default userRoutes;
