/* 
  COMPONENTE FOLLOWING QUE USA EL HELPER GETPROFILE.

    - POR AHORA NO LO USO
    - EL COMPONENTE ESTA PROBADO Y FUNCIONA
    - SOLO LO TENGO COMO EJEMPLO SOBRE COMO USAR EL HELPER SI LLEGARA EL MOMENTO
    - PORQUE POR AHORA SOLO HE TENIDO QUE BUSCAR EL PERFIL (PROFILE) DEL USUARIO LOGADO
      - Y ESTO ES MÁS FACIL OBTENIENDO EL ID DEL USUARIO A PARTIR DEL CONTEXTO

    - QUIZA LO USE COMO EJEMPLO CUANDO NECESITE QUE EL USUARIO LOGADO QUIERA VER LOS PERFILES DE OTROS USUARIOS
      - EN ESTE CASO QUIZA EL USUARIO LOGADO NO LO NECESITE Y LO SUSTITUYA POR EL ID DEL USUARIO DEL QUE SE DESEA VER EL PERFIL
*/

import React, { useEffect, useState } from "react";
import { GLOBAL } from "../../helpers/global";
import { ListUser } from "../user/ListUser";
import { getProfile } from "../../helpers/getProfile";
import { useParams } from "react-router-dom";

// Componente
export const Following = () => {

  // Obtengo el id pasado como parámetro
  const params = useParams();
  const idUser = params.userId;

  // Obtengo el token
  const token = localStorage.getItem("token");

  // Estado que almacenará los usuarios de la red social
  const [users, setUsers] = useState([]);

  // Estado con la pagina actual
  const [page, setPage] = useState(1);

  // Estado para saber si hay más páginas después de la actual
  const [hasMore, setHasMore] = useState(true);

  // Estado que contendrá información sobre si esta cargando o no alguna información
  const [loading, setLoading] = useState(true);

  // Estado que almacena los seguidores del usuario logado
  const [following, setFollowing] = useState([]);

  // Estado que almacene el perfil del usuario
  const [profile, setProfile] = useState({});

  // Efecto que cargará los usuarios de la primera página al inicarse el componente y el perfil del usuario 
  useEffect(() => {
    getInitialUsers(); 
    getProfile(idUser, setProfile);
  }, []);  

  // ------------ FUNCIONES --------------------------------

  // Función que se ejecuta solo durante la primera carga del componente para obtener los usuarios de la primera pagina SOLO
  const getInitialUsers = async () => {

    // Empiezo la carga de usuarios iniciales
    setLoading(true);    

    try {

      // Realizo la petición
      const request = await fetch(GLOBAL.url + "follow/following/" + idUser , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });

      // Almaceno los datos de la petición
      const data = await request.json();

      // Cuanto acabe con exito la consulta y existan documentos que mostrar. Corregido por gemini
      if (data.status === "success" && data.docs) {        
        
        // 1. Mapeamos para obtener el objeto 'followed'.
        const usersFollowed = data.docs.map(followRelation => followRelation.followed);

        // 2. FILTRAMOS CUALQUIER ELEMENTO NULL/UNDEFINED (Esto arregla el error)
        const validUsers = usersFollowed.filter(Boolean);

        // 3. Almacenamos solo los objetos de usuario válidos.
        setUsers(validUsers); 

        // Actualizo si existen más paginas que mostrar
        setHasMore(data.hasNextPage);

        // Actualizo el estado de los seguidores del usuario logado
        setFollowing(data.id_user_following);
        

      } else {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Error en la petición o red:", error);
    } finally {

      // Acabo de cargar
      setLoading(false);

    }

  };

  // Función que carga la siguientes páginas de usuarios, 2, 3, 4, etc. (Concatena los usuarios)
  const getMoreUsers = async (pageToLoad) => {
    
    // Inicio el estado de cargando
    setLoading(true);
    
    try { 

      // Hago la peticion
      const request = await fetch(GLOBAL.url + "follow/following/" + idUser + '/' + pageToLoad, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });

      // Almaceno en data lo resultados de la petición
      const data = await request.json();      

      // Si obtuve respuesta correcta y existen documentos
      if (data.status === "success" && data.docs) {

        // data contiene más información de la que necesito. validUsers ya lo contiene despues de los pasos 1 y 2        
        // 1. Mapeamos la lista de 'relaciones de seguimiento' para obtener solo el objeto 'followed'.
        const usersFollowed = data.docs.map(followRelation => followRelation.followed);

        // 2. Filtramos cualquier elemento NULL/UNDEFINED para asegurar la integridad.
        const validUsers = usersFollowed.filter(Boolean);
        
        // Concatena los usuarios (validUsers) a los usuarios anteriores (prevUsers)
        setUsers((prevUsers) => [...prevUsers, ...validUsers]);

        // Actualizo el estado hasMore con el resultado que me devuelve el pluggin de la paginación
        setHasMore(data.hasNextPage);   

      } else {

        // Ya no hay más páginas
        setHasMore(false);
      }

    } catch (error) {
      console.error("Error en la petición o red:", error);

    } finally {
      // Ya finalizó la carga
      setLoading(false);
    }

  };

  // Función que se ejecuta cada vez que se pulsa el botón "Ver mas personas" y avanza una página
  const nextPage = () => {

    // Añado una pagina y la almaceno en el estado page
    let next = page + 1;
    setPage(next);

    // Obtengo los siguientes usuarios que se iran concatenando
    getMoreUsers(next);

  };

  // Renderizo
  return (
    <>
      <header className="content__header">
        <h1 className="content__title content__title__following">Gente que sigue {profile.name} {profile.surname}</h1>        
      </header>

      {loading ?

          <h2>Cargando ... </h2>

        : 
          
          <ListUser
            users = {users} 
            setUsers = {setUsers}
            following = {following}
            setFollowing = {setFollowing}
            hasMore = {hasMore}
            nextPage = {nextPage}
          />

      }
      
    </>
  );
};

