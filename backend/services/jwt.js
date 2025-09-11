// SERVICIO QUE PERMITE CREAR TOKENS MEDIANTE JWT-SIMPLE

// Importar dependencias
import jwt from 'jwt-simple';
import moment from 'moment';

// Clave secreta como vble de entorno accesible a través de process.env.
export const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('La clave secreta JWT no está definida en las variables de entorno.');
}

// Crear una función para generar tokens. iat es la fecha de creación y exp fecha de expiación
export const createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,        
        iat: moment().unix(),
        exp: moment().add(30,"days").unix()
    }

    // Devolver jwt token codificado
    return jwt.encode(payload, SECRET_KEY);
}
