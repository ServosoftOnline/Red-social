// CONTROLADOR PARA OPERACIONES CON USUARIOS

// Importo el modelo. Ya continene el pluggin de paginacion de mongoose
import User from "./../models/User.js";
import Publications from './../models/Publication.js';
import Follow from './../models/Follow.js';

// Importo bcrypt para encriptar la contraseña
import bcrypt from 'bcrypt'; 

// Importo servicio para crear el token
import { createToken } from "../services/jwt.js";

// Importo el módulo nativo js que usa promesas. Solo será útil en la fase de desarrollo
import fs from 'fs/promises';

// Importo el modulo nativo path
import path from 'path';

// Importo el método si estoy siguiendo a un usuario y si este este me sigue
import {followthisUser, followUserIds} from './../services/followService.js';


// METODOS:

// Método de prueba
export const testUser = (req,res) => {
    return res.status(200).json({
        status: 200,
        message: "Soy una acción de prueba desde: controllers/user.js",
        usuario: req.user
    });
}

// Método para registrar usuarios.
export const register = async (req, res) => {

    try {

        // Obtengo los parametros del body
        const params = req.body;

        // Compruebo que llegan los parámetros obligatorios
        if (!params.name || !params.nick || !params.email || !params.password) {
            return res.status(400).json({
                status: "error",
                message: "Validación mínima incorrecta"            
            });
        }  

        // Evitar usuarios duplicados. No se permiten emails o nicks duplicados
        const users = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();

        // Si existe users y users.length es mayor o igual que uno es que hay una coincidencia
        if (users && users.length >= 1) {
            return res.status(200).send ({
                status: 'success',
                message: 'El usuario ya existe'
            });
        }

        // Sobrescribo el password con una contraseña cifrada mediante bcrypt
        // parametros: Contraseña que quiero cifrar, el numero de veces que se cifra una sobre otra        
        params.password = await bcrypt.hash(params.password, 10);

        // Guardo el usuario en la bbdd        
        // Creo un objeto a guardar ya con la contraseña cifrada
        const user_to_save = new User(params); 

        // Guardo el usuario usando el método save de mongoose y lo almaceno en used_saved
        const user_saved = await user_to_save.save();

        // Respondo que se guardó todo bien y devuelvo el usuario almacenado
        return res.status(200).json({
            status: "success",
            message: "Usuario creado correctamente",
            user_saved: user_saved
        });

    } catch (error) {

        // Respondo que se produjo un error y el mensaje que almacené en el throw
        return res.status(500).json({
            status: "error",
            message: error.message || "Error en el servidor"
        });
    }
};

// Metodo para hacer login
export const login = async(req, res) => {

    try {

        // Recoger parametros
        const params = req.body;

        // Valido si me ha llegado el email y el password
        if (!params.email || !params.password) {
            return res.status(400).json({
                status: "error",
                message: "Validación mínima incorrecta. Debe introducirse el email y el password"            
            });
        }

        // Buscan en la base de datos si existe el usuario a partir de su email
        const user = await User.findOne({ email: params.email.toLowerCase() });

        // Si el usuario no existe, devolvemos un 404
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'El usuario no existe.'
            });
        }

        // Verifico la contraseña
        const passwordMatch = await bcrypt.compare(params.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Password incorrecto.',
                email: params.email,
                password: params.password
            });
        }

        // Le creo un token
        const token = createToken(user);
        
        // Devuelvo los datos del usuario que precise y el token creado
        return res.status(200).json({
            status: "success",
            message: "Identificación correcta",
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                nick: user.nick,
                email: user.email,
                role: user.role,
                image: user.image,
                created_at: user.created_at
            },
            token            
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor al intentar el login."
        });
    }

}

// Método que devuelve el perfil de un usuario
export const profile = async (req,res) => {

    // Recibir el parametro id por la url
    const id = req.params.id;   

    // Consulta para sacar los datos del usuario
    try {

        // Obtengo el usuario a partir de su id excepto el password
        const user = await User.findById(id).select({password:0});

        // Si el usuario no existe, devolvemos un 404
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'El usuario no existe'
            });
        } 
        
        // Información de seguimientos
        const followInfo = await followthisUser(req.user.id, id);

        // Devuelvo los datos del usuario excepto el password
        return res.status(200).json({
            status: "success",
            message: "Información del perfil del usuario",
            user,
            followInfo
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: "Error en el servidor al intentar sacar los datos del usuario. Compruebe el id",
            id
        });

    }

}

// Método que devuelve un listado de los usuarios con paginación
export const list = async (req, res)=> {

    // 1.- Obtener los parámetros de la paginación: La pagina, si no la pasé sera 1
    const page = req.params.page ? parseInt(req.params.page) : 1;        

    // 2.- Opciones de paginacion: limitando el número de paginas, elimino información sensible y ordeno descedente por fecha de creacion
    const options = {
        page: page,
        limit: 5,
        select: '-email -password -role -__v',
        sort: { created_at: -1 }
    };

    // 3.- Ejecutar la consulta con las opciones y el método paginate() y devolver los resultados
    try {

        // Obtengo un array con los seguidores y seguidos del usuario.
        const { following, followers } = await followUserIds(req.user.id);
        
        // Realizo la consulta y la paginación al mismo tiempo gracias al pluggin paginate v2
        const result = await User.paginate({}, options); 
        
        // Devuelvo exito e información
        return res.status(200).json({
            status: 'success',
            message: 'Listado de usuarios',
            docs: result.docs,                  // Los documentos de la página actual
            totalDocs: result.totalDocs,        // Total de documentos en la base de datos
            totalPages: result.totalPages,      // Total de páginas
            page: result.page,                  // Página actual
            hasNextPage: result.hasNextPage,    // Existe una siguiente página?
            hasPrevPage: result.hasPrevPage,     // Existe una pagina anterior
            id_user_following: following,
            id_user_follow_me: followers
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener la lista de usuarios',
            error
        });
    }

}

// Metodo para actualizar el perfil de un usuario
export const update = async (req, res) => {

    try {

        // Recojo la info del usuario autenticado que viene del token.
        const userIdToUpdate = req.user.id; 

        // Recojo la nueva información que viene en el body.
        const infoToUpdate = req.body;

        // Elimino propiedades innecesarias de la infoToUpdate para evitar que el usuario cambie su rol y la fecha de creacion de su perfil
        delete infoToUpdate.role;
        delete infoToUpdate.created_at;        
        
        // Evito usuarios duplicados: nicks o emails
        if (infoToUpdate.nick || infoToUpdate.email) {
            
            // Construyo la consulta dinámicamente
            const query = {
                $or: []
            };

            if(infoToUpdate.nick) {
                query.$or.push({ nick: infoToUpdate.nick.toLowerCase() });
            }
            if (infoToUpdate.email) {
                query.$or.push({ email: infoToUpdate.email.toLowerCase() });
            }

            const users = await User.find(query).exec();

            // Si existe users y users.length es mayor o igual que uno es que hay una coincidencia.
            // Y si además el usuario encontrado no es el mismo que está intentando actualizar su perfil...
            const userIsAlreadyTaken = users && users.length >= 1 && users[0]._id.toString() !== userIdToUpdate;
            
            if (userIsAlreadyTaken) {
                return res.status(200).send({
                    status: 'success',
                    message: 'El nick o el email ya están en uso por otro usuario.'
                });
            }
        }
        

        // Si me llega la password, la cifro antes de actualizar.        
        if (infoToUpdate.password) {
            infoToUpdate.password = await bcrypt.hash(infoToUpdate.password, 10);
        }

        // Buscar y actualizar el usuario con la nueva información.
        const userUpdated = await User.findByIdAndUpdate(userIdToUpdate, infoToUpdate, { new: true });
        
        // Si no se encuentra el usuario, devolvemos un 404.
        if (!userUpdated) {
            return res.status(404).json({
                status: 'error',
                message: 'No se ha encontrado el usuario para actualizar.'
            });
        }
        
        // Devuelvo el usuario actualizado.
        return res.status(200).json({
            status: 'success',
            message: "Perfil actualizado correctamente",
            user: userUpdated
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor al intentar actualizar el perfil."
        });
    }

}

// Método para subir un avatar
export const upload = async (req, res) => {

    // Obtengo el fichero completo
    const file = req.file;

    // Compruebo si se subio el archivo
    if (!file) {
        return res.status(404).send({
            status: "error",
            message: "No se ha proporcionado ningún archivo en la petición."
        });
    }

    // Obtener el nombre del archivo subido a partir del fichero completo
    const image = file.originalname;

    // Sacar la extension del archivo a partir del nombre del archivo
    const extension = image.split('.').pop();

    // Si la extensión del archivo es incorrecta. Elimino el archivo y devuelve el error o la advertencia
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (!allowedExtensions.includes(extension)) {

        // Obtengo el file.path
        const filePath = file.path;

        try {

            // Lo borro            
            await fs.unlink(filePath);

        } catch (unlinkError) {
            
            // Devuelvo error
            return res.status(500).json({
                status: "error",
                message: "Se ha producido un error al intentar borrar el archivo.",
                error: unlinkError.message
            });
        }

        // Devuelvo advertencia
        return res.status(400).send({
            status: "error",
            message: "El archivo adjuntado tiene la extensión: ." + extension + ". Solo se permiten .png, .jpg, .jpeg y .gif"
        });

    }

    // Actualizo el nombre del archivo en la bbdd
    try {

        // Localizo al usuario por su id y actualizo image con el nombre del archivo
        const userUpdated = await User.findByIdAndUpdate(
            req.user.id,
            { image: file.filename },
            { new: true }
        );    
        
        // Devuelvo exito
        return res.status(200).json({
            status: 'success',
            message: 'subida correcta',            
            file: req.file,
            userUpdated
        });

    } catch (error) {

        // En caso de que la actualización en la base de datos falle borro el archivo subido
        try {
            await fs.unlink(file.path);
        } catch (unlinkError) {            
            console.error('Error al intentar borrar el archivo tras un fallo en la base de datos:', unlinkError);
        }

        // Devolvemos la respuesta principal sobre el fallo en la base de datos.        
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el perfil del usuario. Por favor, inténtelo de nuevo más tarde.'
        });
    }

}

// Metodo que obtiene el avatar guardado en mi carpeta local - FASE DE DESARROLLO
export const avatar = async (req, res) => { 

    // Obtengo el parámetro file de la url
    const file = req.params.file;

    // Compruebo si se subio el archivo
    if (!file) {
        return res.status(404).send({
            status: "error",
            message: "No se ha proporcionado ningún archivo en la petición."
        });
    }

    // Montar el path real de la imagen
    const filePath = './img/avatars/' + file;

    // Comprobar que el archivo exite
    try {

        // Busco el archivo
        await fs.stat(filePath);        
        
        // Uso path.resolve() para obtener la ruta absoluta
        return res.sendFile(path.resolve(filePath));

    } catch (error) {

        // Si fs.stat() falla, significa que el archivo no existe (error ENOENT) o hubo algún otro problema. Lo capturamos aquí.
        if (error.code === 'ENOENT') {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el archivo'
            });
        }

        // Para otros errores (permisos, etc.)
        return res.status(500).send({
            status: 'error',
            message: 'Error en el servidor al verificar el archivo'
        });
    }

}

// Método que cuenta los usuarios que siguen al usuario logado o al usario pasado como parametro. 
// Los que sigue y sus publicaciones
export const counters = async (req, res)=> {

    // Obtengo el id del usuario logado
    let idUser = req.user.id;

    // Si le pasé un id por parámetro le doy preferencia y machaco el idUser a realizar los contadores
    if (req.params.id) idUser=req.params.id;

    // Hago los contadores, devuelvo exito e información o error
    try {
        
        const publications = await Publications.countDocuments({'user': idUser});  
        const following = await Follow.countDocuments({'user': idUser});
        const followers = await Follow.countDocuments({'followed': idUser});

        // Devuelvo exito
        return res.status(200).send({
            status: 'success',
            message: 'Número de usuario que esta siguiendo, que le están siguiendo y publicaciones de este id de usuario',
            idUser: idUser,            
            following: following,
            followers: followers,
            publications: publications
        })

    } catch (error) {

        // Devuelvo error
        return res.status(500).send({
            status: 'error',
            message: 'Error al realizar los contadores de los usuarios que esta siguiendo, sus seguidores y sus publicaciones'
        });

    }

}
