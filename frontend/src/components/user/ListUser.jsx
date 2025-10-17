import React from 'react';
import avatar from "./../../assets/img/user.png";
import { fechaFormateada, tiempoRelativo } from "../../helpers/Fechas";
import useAuth from "../../hooks/useAuth";
import { GLOBAL } from "../../helpers/global";
import {Link} from 'react-router-dom';
import { follow } from '../../helpers/follow';
import { unFollow } from '../../helpers/unfollow';


// Componente
export const ListUser = ({users, setUsers, following, setFollowing, hasMore, nextPage}) => {    
   
    // Obtengo el id del usuario logado desde el contexto
    const {auth} = useAuth();
    
    // Renderizo
    return (
        <div className="content__posts">

            {users.map((user) => {
            
                // Devuelvo tantos artículos como usuarios halla excepto al usuario logado
                if(auth._id != user._id) {

                    return (
                        <article className="posts__post" key={user._id}>
                        <div className="post__container">
                            
                            <div className="post__image-user">

                            {/* Si hay imagen para el avatar la muestra si no muestra el avatar por defecto */}
                            <Link to={"/social/profile/" + user._id} className="post__image-link">
                                {user.image && user.image !== "default.png" ? 
                                    <img
                                        src={GLOBAL.url + "user/avatar/" + user.image}
                                        className="post__user-image"
                                        alt="Foto de perfil"
                                    />
                                 : 
                                    <img
                                        src={avatar}
                                        className="post__user-image"
                                        alt="Foto de perfil"
                                    />
                                }
                            </Link>

                            </div>

                            <div className="post__body">
                                <div className="post__user-info">

                                    <Link to={"/social/profile/" + user._id} className="user-info__name">
                                        {user.name} {user.surname}
                                    </Link>

                                    <span className="user-info__divider"> | </span>

                                    <Link to={"/social/profile/" + user._id}  className="user-info__create-date">
                                        {fechaFormateada(user.created_at)} -{" "}
                                        {tiempoRelativo(user.created_at)}
                                    </Link>

                                </div>

                                <h4 className="post__content">{user.bio}</h4>

                            </div>

                        </div>

                        {/* Si el usuario que estoy recorriendo es seguidor del usuario logado. Mostaré dejar de seguir */}
                        {/* No mostraré botón al usuario logado */}
                        <div className="post__buttons">

                            {following.includes(user._id) ? 

                                <button                         
                                    className="post__button post__button--green"
                                    onClick={(e) => unFollow(e, user._id, setFollowing)} 
                                >
                                    Dejar de seguir
                                </button>
                                :
                                <button                        
                                    className="post__button post__button--red"
                                    onClick={(e) => {follow(e,user._id, setFollowing)}}
                                >
                                    Seguir
                                </button>
                            }

                        </div>
                        
                        </article>
                    );
                }

            })}

            {/* Solo mostrará el boton si hasmore es true */}
          <div className="content__container-btn">
            {hasMore && (
              <button className="content__btn-more-post" onClick={nextPage}>
                Ver mas personas
              </button>
            )}
          </div>

        </div>
    )
}
