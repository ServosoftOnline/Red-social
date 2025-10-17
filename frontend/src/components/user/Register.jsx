// COMPONENTE PARA EL REGISTRO DE USUARIOS

import React, {useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { GLOBAL } from '../../helpers/global';

export const Register = () => {

  // Obtengo el estado formulario y la funcion que gestiona los cambios del formulario
  const {form, changed, resetForm} = useForm();

  // Creo un estado que almacenará si se guardó o no de forma correcta el usuario
  const [saved, setSaved] = useState("not_sended");

  // Función que recoge los datos del formulario
  const saveUser = async (e) => {
    e.preventDefault();

    // Reinicio el estado al inicio de cada intento
    setSaved("not_sended"); 

    // Creo una vble que almacenará el estado con los datos del usuario
    let newUser = form;

    try {

      // Almacenar el usuario en el backend. 
      const request = await fetch(GLOBAL.url + 'user/register', {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Hago los datos de las request legible
      const data = await request.json();

      // Actualizo el estado saved con el resultado del proceso y reseteo el formulario
      if (request.ok) { 
          // CÓDIGO 2XX: Éxito total.
          setSaved("saved");
          resetForm();


      } else if (request.status === 409) {
          // CÓDIGO 409: Usuario duplicado, mensaje específico.
          setSaved("duplicate");

      } else {
          // Otros códigos de error (400, 500, etc.).
          setSaved('error');
      }

    } catch (error) {

      // Fallo de red (servidor apagado) o error de parseo.
      console.error("Error en la petición o red:", error);
      setSaved('error');

    }   

  }    


  // Renderizo
  return (
    <>
      <header className="content__header">
          <h1 className="content__title content__title__register">Registro</h1>        
      </header>

      <div className="content__posts">        

        {/* formulario */}
        <form className='register-form' onSubmit={saveUser}>

          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input
              type='text'
              name='name' 

              // Campo controlado
              value={form.name || ''}

              onChange={changed}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Apellidos</label>
            <input
              type='text'
              name='surname'

              // Campo controlado
              value={form.surname || ''}

              onChange={changed}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='nick'>Nick</label>
            <input
              type='text'
              name='nick'

              // Campo controlado
              value={form.nick || ''}

              onChange={changed}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Correo electrónico</label>
            <input
              type='email'
              name='email'

              // Campo controlado
              value={form.email || ''}

              onChange={changed}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input
              type='password'
              name='password'

              // Campo controlado
              value={form.password || ''}
              onChange={changed}
            />
          </div>

          <input type='submit' value="Registrate" className='btn btn-success' />

        </form>

      </div>

      {/* Resultado del proceso de registro */}
      <div className='alert'>

        {saved=='saved' ? <strong className='alert-success'>Registro correcto. Ya puede acceder desde Login con su email y contraseña</strong>: ''}
        {saved=='error' ? <strong className='alert-danger'>Error al registrar al usuario</strong>: ''}
        {saved=='duplicate' ? <strong className='alert-danger'>Error: El usuario ya existe (Nick o Email en uso).</strong>: ''} 
        
      </div> 
      
    </>
  )
}
