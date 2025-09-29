// Asigno el metodo Router de express y creo las rutas de follow
import express from "express";
const followRoutes = express.Router();

// Importo los métodos del controlador
import  {pruebaFollow, save, unFollow, following, followers} from "./../controllers/follow.js";

// Importo el middelware para verificar el token
import { auth } from "../middleware/auth.js";

// RUTAS

// Ruta de prueba
followRoutes.get('/ruta-de-prueba-follow', pruebaFollow);

// Ruta para seguir a alguien
followRoutes.post('/save', auth, save);

// Ruta para dejar de seguir a alguien
followRoutes.delete('/delete/:id', auth, unFollow);

// Rutas para listar los usuarios que un usuario está siguiendo y para listar los usuarios que el usario logado está siguiendo.
// Los parámetros id y page son opcionales por lo que preciso 3 rutas para cubrir todos los casos
// Si solo enviara page lo gestiono desde el controlador
followRoutes.get('/following/', auth, following);           // Sin id ni page
followRoutes.get('/following/:id', auth, following);        // Solo con id
followRoutes.get('/following/:id/:page', auth, following);  // Con ambos, id y page

// Rutas para listar a los usuarios que siguen a otro usuario o que siguen al usuario logado
// Tambien require de 3 rutas al igual que following y gestiona page desde el controlador
followRoutes.get('/followers/', auth, followers);           // Sin id ni page
followRoutes.get('/followers/:id', auth, followers);        // Solo con id
followRoutes.get('/followers/:id/:page', auth, followers);  // Con ambos, id y page


// Exporto las rutas de follow
export default followRoutes;