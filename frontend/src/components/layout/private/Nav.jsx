// COMPONENTE CON LA NAVEGACION PRIVADA

import React from 'react';
import avatar from './../../../assets/img/user.png';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { GLOBAL } from '../../../helpers/global';

export const Nav = () => {

    // Obtengo la información del usuario desde el contexto
    const {auth} = useAuth();

    // Renderizo
    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">

                <li className="menu-list__item">
                    <NavLink to="/social" className="menu-list__link">
                        <i className="fa-solid fa-house"></i>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/social/feed" className="menu-list__link">
                        <i className="fa-solid fa-list"></i>
                        <span className="menu-list__title">Timeline</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/social/people" className="menu-list__link">
                        <i className="fa-solid fa-user"></i>
                        <span className="menu-list__title">Gente</span>
                    </NavLink>
                </li>
                
            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">

                    {/* Si hay imagen para el avatar la muestra si no muestra el avatar por defecto */}
                    <NavLink to={"/social/profile/" + auth._id} className="list-end__link-image">
                        {auth.image && auth.image !== "default.png" ?
                            <img 
                                src={GLOBAL.url + 'user/avatar/' + auth.image}
                                className="list-end__img"
                                alt="Imagen de perfil" 
                            />
                            :
                            <img 
                                src={avatar}
                                className="list-end__img"
                                alt="Imagen de perfil" 
                            />
                        }
                    </NavLink>
                    
                </li>
                

                <li className="list-end__item">
                    <NavLink to={"/social/profile/" + auth._id} className="list-end__link">
                        <span className="list-end__name">{auth.nick}</span>                        
                    </NavLink>
                </li>

                <li className="list-end__item">
                    <NavLink to="/social/config" className="list-end__link">
                        <i className='fa-solid fa-gear' />
                        <span className="list-end__name">Ajustes</span>                        
                    </NavLink>
                </li>

                <li className="list-end__item">
                    <NavLink to="/social/logout" className="list-end__link">
                        <i className='fa-solid fa-arrow-right-from-bracket' />
                        <span className="list-end__name">Cerrar sesión</span>                        
                    </NavLink>
                </li>

            </ul>

        </nav>
    )
}
