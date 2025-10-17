/*
  COMPONENTE QUE MUESTRA TODOS LOS USUARIOS DE LA RED SOCIAL CON PAGINACIÓN

    - Tiene dos funciones:

      - La primera obtiene los usuarios que se mostrarán en la primera página
        - Se cargará en el efecto que se ejecuta al ejecutar el componente por primera vez

      - La segunda ira pasando de página y concatenará los usuarios que se van obteniendo
        - Se cargará cada vez que le de al botón de mostrar mas usuarios

  - El estado hasMore tendŕa control sobre la existencia de una pagina siguiente
  - Si no hay más páginas no mostrará el icono de mostrar mas usuarios
*/

import React, { useEffect, useState } from "react";
import { GLOBAL } from "../../helpers/global";
import { ListUser } from "./ListUser";

// Componente
export const People = () => {

  // Obtengo el token
  const token = localStorage.getItem("token");

  // ------------ ESTADOS --------------------------------

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

  // Efecto que cargará los usuarios de la primera página al inicarse el componente
  useEffect(() => {
    getInitialUsers();    
  }, []);  

  // ------------ FUNCIONES --------------------------------

  // Función que se ejecuta solo durante la primera carga del componente para obtener los usuarios de la primera pagina SOLO
  const getInitialUsers = async () => {

    // Empiezo la carga de usuarios iniciales
    setLoading(true);    

    try {

      // Realizo la petición
      const request = await fetch(GLOBAL.url + "user/list/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });

      // Almaceno los datos de la petición
      const data = await request.json();

      // Cuanto acabe con exito la consulta y existan documentos que mostrar
      if (data.status === "success" && data.docs) {

        // Al ser la primera carga, SIMPLEMENTE REEMPLAZAMOS (no concatenamos)
        setUsers(data.docs);

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
      const request = await fetch(GLOBAL.url + "user/list/" + pageToLoad, {
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

        // Concatena los usuarios
        setUsers((prevUsers) => [...prevUsers, ...data.docs]);

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
        <h1 className="content__title__people">Gente</h1>
      </header>

      {loading ?

          (<h2>Cargando ... </h2>)

        : (
          <> 
            <ListUser
              users = {users} 
              setUsers = {setUsers}
              following = {following}
              setFollowing = {setFollowing}

              // AÑADIR ESTAS DOS PROPS NUEVAS
              hasMore = {hasMore}
              nextPage = {nextPage}
            />
          

          

        </>

      )}
      
    </>
  );
};
