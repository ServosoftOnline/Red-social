// Asigno el metodo Router de express y creo las rutas de publication
import express from "express";
const publicationRoutes = express.Router();

// Importo los métodos del controlador
import  {pruebaPublication, save, detail, erase, publicationOneUser, upload, media, feed} from "./../controllers/publication.js";

// Importo el middelware para verificar el token
import { auth } from "../middleware/auth.js";

// Importo el middleware multer para poder subir archivos
import multer from "multer";

// ALMACENAMIENTO DE IMAGENES - FASE DE DESARROLLO
// Configuro el almacenamiento de los archivos
const localStorage = multer.diskStorage({

    // Carpeta donde se almacenarán
    destination: (req, file, cb) => {
        cb(null, './img/publications');
    },

    // Estructura del nombre de los archivos
    filename: (req, file, cb) => {
        cb(null, "pub" + Date.now() + file.originalname);
    }
});

// Indico a multer las caracteristicas del almacenamiento - FASE DE DESARROLLO
const localUploads = multer({storage:localStorage});

// Establezco las rutas
publicationRoutes.get('/ruta-de-prueba-publication', pruebaPublication);
publicationRoutes.post('/save',auth, save);
publicationRoutes.get('/detail/:id',auth, detail);
publicationRoutes.delete('/erase/:id',auth, erase);

// Establezco dos rutas para las publicaciones de un usuario. Siendo opcional el envio de la pagina
publicationRoutes.get('/one-user/:id/:page', auth, publicationOneUser);
publicationRoutes.get('/one-user/:id', auth, publicationOneUser);

// Ruta para subir archivos, añado los middlewares auth y multer indicando que solo subo un archivo - FASE DE DESARROLLO
publicationRoutes.post('/upload/:id', auth, localUploads.single('file0'), upload);

// Ruta para obtener los archivos multimedia almacenados localmente - FASE DE DESARROLLO
publicationRoutes.get('/media/:file', media);

// Ruta para el feed
publicationRoutes.get('/feed/:page', auth, feed);
publicationRoutes.get('/feed/', auth, feed);

// Exporto las rutas de publication
export default publicationRoutes;