// Asigno el metodo Router de express y creo las rutas de user
import express from "express";
const userRoutes = express.Router();

// Importo los métodos del controlador
import {testUser, register, login, profile, list, update, upload, avatar, counters} from "./../controllers/user.js";

// Importo el middelware para verificar el token
import { auth } from "../middleware/auth.js";

// Importo el middleware multer para poder subir archivos
import multer from "multer";

// ALMACENAMIENTO DE IMAGENES - FASE DE DESARROLLO
// Configuro el almacenamiento de los archivos
const localStorage = multer.diskStorage({

    // Carpeta donde se almacenarán
    destination: (req, file, cb) => {
        cb(null, './img/avatars');
    },

    // Estructura del nombre de los archivos
    filename: (req, file, cb) => {
        cb(null, "avatar" + Date.now() + file.originalname);
    }
});

// Indico a multer las caracteristicas del almacenamiento
const localUploads = multer({storage:localStorage});

// Establezco las rutas públicas, las que no precisen de authentificatión: Registro, login y obtener avatar
userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/avatar/:file', avatar);

// Establezco las rutas privadas que requeriran de autentificación mediante el middleware auth
userRoutes.get('/test-user', auth, testUser);
userRoutes.get('/profile/:id', auth, profile);

// Establezco dos rutas para el listado de usuarios porque no me permite usar el ? para indicar que es opcional
userRoutes.get('/list/:page', auth, list); 
userRoutes.get('/list/', auth, list);

// Ruta para que los usuarios actualizen su propio perfil
userRoutes.put('/update', auth, update);

// Ruta para subir avatares, añado los middlewares auth y multer indicando que solo subo un archivo
userRoutes.post('/upload', auth, localUploads.single('file0'), upload);

// Ruta de contadores
userRoutes.get('/counters/:id', auth, counters);
userRoutes.get('/counters', auth, counters);

// Exporto todas las rutas de user
export default userRoutes;
