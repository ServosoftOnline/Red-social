// COMPONENTE PARA EL LOGIN DE USUARIOS
import React, {useState} from 'react'
import { useForm } from '../../hooks/useForm';
import { GLOBAL } from '../../helpers/global';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Componente
export const Login = () => {

  // Obtengo el estado formulario y la funcion que gestiona los cambios del formulario
  const {form, changed} = useForm();

  // Creo un estado que almacenará el resultado del login
  const [login, setLogin] = useState("not_logged");

  // Obtengo setAuth del contexto
  const {setAuth} = useAuth();

  // Función que recoge los datos del formulario
  const loginUser = async (e) => {
    e.preventDefault();   
    
    // Reinicio el estado al inicio de cada intento
    setLogin("not_logged"); 

    // Creo una vble que almacenará el estado con los datos del usuario
    let user = form;

    // Realizo la consulta en el backend
    try {

      // Localizo al usuario
      const request = await fetch(GLOBAL.url + 'user/login', {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Recogo los datos de la consulta y los hago legibles
      const data = await request.json();

      // Muestro los datos obtenidos desde el backend
      // console.log(data);

      // Si obtube obtuve usuario de forma correcta
      if (request.ok) {

        // Almaceno tokey y usuario en local storage
        localStorage.setItem("token", data.token);        
        localStorage.setItem("user", JSON.stringify(data.user));    

        // Actualizo los estados de login y de la sesion
        setLogin("loginOk");    
        setAuth(data.user);

        // Espero 2 segundos y recargo la pagina. Al ya estar logado, cuando recarge, se abrirá la zona privada
        setTimeout(() => {
          window.location.reload();
        }, 2000);


      } else {
        setLogin('loginKo');
      }

    } catch (error) {

      // Fallo de red (servidor apagado) o error de parseo.
      console.error("Error en la petición o red:", error);
      setLogin('error');

    }

  }

  // Renderizo
  return (
    <>
      <header className="content__header">
          <h1 className="content__title content__title__login">Login</h1>        
      </header>

      <div className="content__posts">

        {/* Formulario */}
        <form className='form-login' onSubmit={loginUser}>

          <div className='form-group'>
            <label htmlFor='email'>Correo electrónico</label>
            <input
              type='email'
              name='email'
              onChange={changed}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input
              type='password'
              name='password'
              onChange={changed}
            />
          </div>

          <input type='submit' value="Identifícate" className='btn btn-success' />

        </form>

      </div>

      {/* Resultado del proceso de registro */}
      <div className='alert'>

        {login=='loginOk' ? <strong className='alert-success'>Acceso correcto</strong> : ''}

        {login=='loginKo' ?
          <strong className='alert-danger'>
            Acceso incorrecto. Compruebe que los datos de acceso sean correctos
          </strong>: ''}      

        {login=='error' ? <strong className='alert-danger'>Error en el servidor</strong>: ''}  
        
      </div> 

      

    </>
  )
}
