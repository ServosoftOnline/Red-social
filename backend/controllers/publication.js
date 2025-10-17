// CONTROLADOR PUBLICATIONS

// Modelo
import Publication from "../models/Publication.js";

// Modulos útiles para trabajar con archivos locales. FASE DE DESARROLLO
import fs from 'fs/promises';
import path from 'path';

// Servicio
import { followUserIds } from "../services/followService.js";

// METODOS DEL CONTROLADOR

// Método de prueba
export const pruebaPublication = (req,res) => {
    return res.status(200).json({
        status: 200,
        message: "Soy una acción de prueba desde: controllers/publication.js"
    });
}

// Método para guardar una publicación
export const save = async (req, res) => {

    try {

        // Obtengo el id del usuario logado
        const id_user = req.user.id;

        // Obtengo los parametros del body
        const params = req.body;

        // Compruebo que llegan los parámetros obligatorios
        if (!params.text) {
            return res.status(400).send({
                status: "error",
                message: "Validación mínima incorrecta"            
            });
        }

        // Crear y rellenar el objeto del modelo
        let publication_to_save = new Publication(params);
        
        // Añado el id del usuario logado a la publicación
        publication_to_save.user = id_user;

        // Guardar el objeto en la bbdd
        const publication_saved = await publication_to_save.save();

        // Devuelvo exito
        return res.status(200).send({
            status: 'success',
            message: 'Publicación guardada correctamente',
            publication_saved: publication_saved
        })

    } catch (error){

        // Devuelvo error
        return res.status(500).send({
            status: 'error',
            message: 'Error al guardar el seguidor',
            error
        })
    }

}

// Método para obtener una publicación
export const detail = async (req, res) => {

    try {

        // Obtengo el id de la publicación pasado como parámetro
        const id = req.params.id;

        // Localizo la publicación a partir del id
        const publication_detail = await Publication.findById(id).select();

        // Devolver exito
        return res.status(200).send({
            status: 'success',
            message: 'Publicación obtenida de forma correcta',            
            publication_detail: publication_detail
        })

    } catch (error) {

        // Devuelvo error
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los detalles de una publicación",
            id_publication: id         
        });

    }

}

// Método para eliminar publicaciones
export const erase = async (req, res) => {

    try {

        // Obtengo el id de la publicación a eliminar pasado como parámetro
        const publicationId = req.params.id;        

        // Elimino la publicacion a partir del id obtenido        
        const publicationDeleted = await Publication.findOneAndDelete({ _id: publicationId });
        
        // Si no encuentro la publicación lo indico, y si la encontré y la eliminé devuelvo exito
        if(!publicationDeleted) {

            // Devolver que no encontré la publicación
            return res.status(404).send({
                status: 'error',
                message: 'No se encontró ninguna publicación'                
            })

        } else {

            // Devolver exito
            return res.status(200).send({
                status: 'success',
                message: 'Publicación eliminada de forma correcta',
                publicationDeleted: publicationDeleted
            })

        }

    } catch (error){

        // Devuelvo error
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar una publicación",
            publicationId: id         
        });
    }

}

// Método para listar todas las publicaciones de un usuario con paginación
export const publicationOneUser = async (req, res) => {

    try {

        // Obtengo el ID del usuario desde los parámetros de la URL
        const userId = req.params.id;

        // Obtengo la página opcional a mostrar. Si no la paso, será 1
        const page = req.params.page ? parseInt(req.params.page) : 1;
       
        // Opciones de la paginación: orden descendente por fecha de creación, elimino __v, populate por usuario e indico lo que deseo mostrar
        const options = {
            page: page,
            limit: 5,
            sort: { created_at: -1 },   
            select: '-__v', 
            populate: {
                path: 'user',
                select: 'name surname nick image -_id'
            }
        };

        // El pluggin de la paginación hace la consulta y pagina según las opciones, filtrando por el id almacenado en user
        const result = await Publication.paginate({ user: userId }, options); 

        // Si el usuario no tiene publicaciones devuelvo esto
        if (result.totalDocs === 0) {
            return res.status(404).json({
                status: "success",
                message: "El usuario no tiene publicaciones aún."
            });
        }

        // Si el usuario llegó al final de sus publicaciones porque ya no existen más paginas que mostrar devuelvo esto
        if (result.docs.length === 0) {
            return res.status(404).json({
                status: "success",
                message: "No se encontraron más publicaciones."
            });
        }

        // Devuelvo las publicaciones paginadas
        return res.status(200).send({
            status: 'success',
            message: 'Listado correcto de las publicaciones de un usuario',            
            docs: result.docs,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            page: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
        });

    } catch (error) {

        // Devuelvo error en la ejecucion del proceso
        return res.status(500).json({
            status: "error",
            message: "Error al listar las publicaciones de un usuario",
            details: error.message
        });
    }
}

// Método para subir imagenes en publicaciones del usuario
export const upload = async (req, res) => {

    // Obtengo el id de la publicacion pasado como parametro
    const publicationId = req.params.id;

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

        // Localizo la publicación por id y actualizo image con el nombre del archivo
        const publicationUpdated = await Publication.findByIdAndUpdate(
            publicationId,
            { file: file.filename },
            { new: true }
        );    
        
        // Devuelvo exito
        return res.status(200).json({
            status: 'success',
            message: 'subida correcta',            
            publicationUpdated: publicationUpdated,
            file: req.file            
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

// Método para obtener archivos multimedia - FASE DE DESARROLLO
export const media = async (req, res) => {

    // Obtengo el parámetro file de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = './img/publications/' + file;

    // Comprobar que el archivo exite
    try {

        // Busco el archivo
        await fs.stat(filePath);        
        
        // Uso path.resolve() para obtener la ruta absoluta y devolver el fichero indicando el exito del proceso
        return res.sendFile(path.resolve(filePath));

    } catch (error) {

        // Si fs.stat() falla, significa que el archivo no existe (error ENOENT) o hubo algún otro problema. Lo capturamos aquí.
        if (error.code === 'ENOENT') {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el archivo' + filePath                
            });
        }

        // Para otros errores (permisos, etc.)
        return res.status(500).send({
            status: 'error',
            message: 'Error en el servidor al verificar el archivo',
            filePath: filePath
        });
    }

}

// Método para listar paginado todas las publicaciones de los usuarios que estoy siguiendo (FEED)
export const feed = async (req, res) => {

    try {

        // Obtengo la página opcional a mostrar. Si no la paso, será 1
        const page = req.params.page ? parseInt(req.params.page) : 1;

        // Obtengo el perfil del usuario logado
        const user = req.user;   

        // Obtengo un array con los id de quienes siguen al usuario logado
        const { following } = await followUserIds(user.id);

        // Opciones de la paginación: orden descendente por fecha de creación, elimino __v, populate por usuario e indico lo que deseo mostrar
        const options = {
            page: page,
            limit: 5,
            sort: { created_at: -1 },   
            select: '-__v', 
            populate: {
                path: 'user',
                select: '_id name surname nick image '
            }
        };

        // El pluggin de la paginación hace la consulta y pagina según las opciones
        const result = await Publication.paginate({ user: following }, options); 

        // No existen más paginas que mostrar
        if (result.docs.length === 0) {
            return res.status(404).json({
                status: "success",
                message: "fin del feed del usuario."
            });
        }

        // Devuelvo las publicaciones paginadas
        return res.status(200).send({
            status: 'success',
            message: 'feed del usuario',
            id: user.id,
            name: user.name,
            surname: user.surname,
            nick: user.nick,
            image: user.image,
            following: following,
            docs: result.docs,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            page: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
        });

    } catch (error) {

        // Devuelvo error
        return res.status(500).json({
            status: 'error',
            message: 'Error al listar las publicaciones de los usuarios que estoy siguiendo (FEED)'
        });

    }
}   
