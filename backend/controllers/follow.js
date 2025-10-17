// CONTROLADOR FOLLOWS

// Importo los modelos
import Follow from "./../models/Follow.js";
import mongoose from 'mongoose';

// Importo servicios
import { followUserIds } from "../services/followService.js";

// METODOS
// Metodo de prueba
export const pruebaFollow = (req,res) => {
    return res.status(200).json({
        status: 200,
        message: "Soy una acción de prueba desde: controllers/follow.js"
    });
}

// Metodo para seguir a alguien. 
// El usuario logado sigue a otro usuario cuyo id le viene pasado por el body
export const save =  async (req, res) => {

    // Obtengo el id del usuario al que quiere seguir el usuario identificado que viene desde el body
    const id_followed = req.body.followed;

    // Obtengo el id del usuario que se encuentra identificado
    const id_user = req.user.id;    

    // Validar si el usuario ya sigue a id_followed. Si no lo siguiera guarda el objeto en la bbdd
    try {

        // Compruebo si ya lo sigue
        const existingFollow = await Follow.findOne({
            user: id_user,
            followed: id_followed
        });

        // Si ya existe, devuelve un error 409 Conflict
        if (existingFollow) {            
            return res.status(409).send({
                status: 'error',
                message: 'Ya sigues a este usuario.'                
            });
        }

        // Si no lo sigue continuo con el proceso guardando el objeto en la bbdd

        // Crear objeto con el modelo
        const userToFollow = new Follow({
            user: id_user,
            followed: id_followed
        });

        // Guardo el usuario usando el método save de mongoose y lo almaceno en used_saved
        const followSaved = await userToFollow.save();

        // Devuelvo exito y lo que guardé en la bbdd
        return res.status(200).send({
            status: 'success',
            message: 'Seguidor añadido',            
            followSaved
        })

    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al guardar el seguidor',
            error
        })

    }

}

// Metodo para dejar de seguir a alguien
export const unFollow = async (req, res) => {

    // Obtengo el id del usuario que deja de seguir (el logueado)
    const userId = req.user.id;

    // Obtengo el id del usuario al que deja de seguir (del parámetro de la URL)
    const followedId = req.params.id;
    
    // Validar si el ID pasado en el parámetro es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(followedId)) {
        return res.status(400).send({
            status: 'error',
            message: 'El ID proporcionado no es un ObjectId válido.'
        });
    }    

    // Elimino el follow
    try {

        // Ejecuto la eliminación del follow
        const followDeleted = await Follow.findOneAndDelete({
            user: userId,
            followed: followedId
        });

        // Si no lo encuentra significa que no lo sigue y no se borra nada
        if (!followDeleted) {
            return res.status(404).send({
                status: 'error',
                message: 'No sigues a este usuario.'
            });
        }

        // LLegado a este punto es que se ha producido la eliminación del seguimiento y devuelvo el elemento eliminado
        return res.status(200).send({
            status: 'success',
            message: 'Dejaste de seguir a este usuario.',
            followDeleted
        });
        
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Error al eliminar el follow.',
            error
        });
    }
};

/* 
    Metodo para listar los usuarios que un usuario concreto o el usuario logado este siguiendo
    Recordar que de forma opcional me pueden enviar un id y una pagina
    Si me llegara un usuario concreto por la url este tendrá mas prioridad que el usuario logado
*/

export const following = async (req, res) => {

    // Obtener el id del usuario logado
    let userId = req.user.id;

    // Si me llegara un id por parametro este seria el del usuario concreto y tendria más prioridad por lo que machaco el userId
    if(req.params.id) userId= req.params.id;

    // Valido el formato del ID
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            status: 'error',
            message: 'El ID proporcionado no es un ObjectId válido.'
        });
    }

    // Comprobar si me llega la pagina a mostrar, si no llegara por parámetro sería la 1
    let page = 1;
    if(req.params.page) page = parseInt(req.params.page);    

    // Si no hay parametro de ruta, compruebo si viene como query parameter
    // Valdría para este tipo de rutas: http://localhost:3900/api/follow/following/?page=5.
    // Quiero la pagina 5 de los usuarios que sigue el usario logado
    else if (req.query.page) {
        page = parseInt(req.query.page);
    }
    
    // Hago la consulta al backend
    try {

        // Obtengo un array con los seguidores y seguidos del usuario.
        const { following, followers } = await followUserIds(userId);
        
        // Opciones de paginacion por orden descedente de fecha de creacion. Populando la información del usuario que sigue
        // Filtro información sensible como el password y el rol  y el email      
        const options = {
            page: page,
            limit: 5,
            sort: { created_at: -1 },            
            populate: {
                path: 'followed',
                select: '-password -role -__v -email' 
            }
        };
        
        // Ejecuto la consulta con las opciones, aplico la paginacion y almaceno el resultado
        const result = await Follow.paginate({ user: userId }, options); 
                
        // Devuelvo exito, el usuario, la pagina que muestro y el resultado de la consulta ya paginado
        return res.status(200).json({
            status: 'success',
            message:'Listado de usuarios que un usuario o el usuario logado está siguiendo',                        
            docs: result.docs,                  // Los documentos de la página actual
            totalDocs: result.totalDocs,        // Total de documentos en la base de datos
            totalPages: result.totalPages,      // Total de páginas
            page: result.page,                  // Página actual
            hasNextPage: result.hasNextPage,    // Existe una siguiente página?
            hasPrevPage: result.hasPrevPage,    // Existe una pagina anterior
            id_user_following: following,
            id_user_follow_me: followers
            
        });        

    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'error al localizar a quien sigue el usuario'
        })
    }

}

// Metodo para listar a los usuarios que siguen a un usuario concreto o al usuario logado
export const followers = async (req, res) => {

    // Obtener el id del usuario logado
    let userId = req.user.id;

    // Si me llegara un id por parametro este seria el del usuario concreto y tendria más prioridad por lo que machaco el userId
    if(req.params.id) userId= req.params.id;

    // Valido el formato del ID
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            status: 'error',
            message: 'El ID proporcionado no es un ObjectId válido.'
        });
    }

    // Comprobar si me llega la pagina a mostrar, si no llegara por parámetro sería la 1
    let page = 1;
    if(req.params.page) page = parseInt(req.params.page);    

    // Si no hay parametro de ruta, compruebo si viene como query parameter
    // Valdría para este tipo de rutas: http://localhost:3900/api/follow/following/?page=5.
    // Quiero la pagina 5 de los usuarios que sigue el usario logado
    else if (req.query.page) {
        page = parseInt(req.query.page);
    }

    
    // Consulto al backend
    try {        

        // Obtengo un array con los seguidores y seguidos del usuario.
        const { following, followers } = await followUserIds(userId);

        // Opciones de paginacion por orden descedente de fecha de creacion. Populando la información del usuario que sigue
        // Filtro información sensible como el password, el rol y el email
        const options = {
            page: page,
            limit: 5,
            sort: { created_at: -1 },            
            populate: { path: 'user', select: '-password -role -__v -email' }
        };
        
        // Ejecuto la consulta con las opciones, aplico la paginacion y almaceno el resultado
        const result = await Follow.paginate({ followed: userId }, options); 
                
        // Devuelvo exito, el usuario, la pagina que muestro y el resultado de la consulta ya paginado
        return res.status(200).json({
            status: 'success',
            message:'Listado de seguidores de un usuario pasado como id o del usuario logado',         
            docs: result.docs,                  // Los documentos de la página actual
            totalDocs: result.totalDocs,        // Total de documentos en la base de datos
            totalPages: result.totalPages,      // Total de páginas
            page: result.page,                  // Página actual
            hasNextPage: result.hasNextPage,    // Existe una siguiente página?
            hasPrevPage: result.hasPrevPage,    // Existe una pagina anterior
            id_user_following: following,
            id_user_follow_me: followers
            
        });        

    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'error al localizar a quien sigue el usuario'
        })
    }

}

