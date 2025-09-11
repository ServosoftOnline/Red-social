/*
    MIDDLEWARE: AUTH.JS

        - Compruebará si se dispone del token
        - Lo colocaré en medio de las rutas 
        - Si se dispone del token se ejecutará la ruta
    
*/

// Importar modulos
import jwt from 'jwt-simple';
import moment from 'moment';

// Importar clave secreta
import { SECRET_KEY } from '../services/jwt.js';

// Funcion de autentificacion
export const auth = (req, res, next) => {

    // Comprobar si me llega la cabecera llamada authorization
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'error',
            message: 'La petición no tiene la cabecera de autorización'
        })

    }

    // Limpio el token: Si contiene comillas simples o dobles las sustituyo por espacios en blanco
    const token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar el token
    try {

        // Obtengo el payload mediante mi clave secreta
        const payload = jwt.decode(token, SECRET_KEY);

        // Comprobar expiación del token. Si la fecha de expiación es menor o igual que la fecha actual
        if(payload.exp <= moment().unix()) {
            res.status(404).send({
                status: 'error',
                message: 'Token expirado',
                error
            })
        }

        // Agregar datos de usuario a request sila decodificación ha sido correcta
        req.user = payload;

    } catch (error) {
        res.status(404).send({
            status: 'error',
            message: 'Token inválido',
            error
        })
        
    }

    // Pasar a la siguiente acción
    next();

}



