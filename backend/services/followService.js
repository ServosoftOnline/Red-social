// SERVICIO QUE PROPORCIONA LOS ARRAYS CON LOS IDs DE LOS USUARIOS QUE SIGUEN
// A UN USUARIO EN CONCRETO Y A LOS QUE SIGUE ESTE USUARIO CONCRETO

// Modelo
import Follow from "../models/Follow.js";

export const followUserIds = async (identityUserId) => {
    try {
        // Encontrar los usuarios que el usuario principal está siguiendo.
        // Se selecciona solo el campo 'followed' para que la consulta sea más ligera.
        const following = await Follow.find({'user': identityUserId}).select('followed');
        
        // Encontrar los usuarios que están siguiendo al usuario principal.
        // Se selecciona solo el campo 'user'.
        const followers = await Follow.find({'followed': identityUserId}).select('user');

        // Procesar los resultados para obtener solo los IDs
        let following_clean = [];
        following.forEach(follow => {
            following_clean.push(follow.followed);
        });

        let followers_clean = [];
        followers.forEach(follow => {
            followers_clean.push(follow.user);
        });

        // Devolver un objeto con arrays de IDs
        return {
            following: following_clean,
            followers: followers_clean
        }

    } catch (error) {
        console.error("Error en el servicio followUserIds:", error);
        return {
            following: [],
            followers: []
        }
    }
};


// Método si estoy siguiendo a un usuario y si este este me sigue
export const followthisUser = async (identityUserId, profileUserId) => {

    // console.log(identityUserId);
    // console.log(profileUserId);
    
    try {
        // Primera consulta para verificar si el usuario sigue al perfil.
        const following = await Follow.findOne({ 
            'user': identityUserId, 
            'followed': profileUserId 
        });

        // Segunda consulta para verificar si el perfil sigue al usuario.
        const follower = await Follow.findOne({ 
            'user': profileUserId, 
            'followed': identityUserId 
        });

        return {
            following,
            follower
        };

    } catch (error) {
        console.error("Error al consultar la relación de seguimiento:", error);
        throw error;
    }
};