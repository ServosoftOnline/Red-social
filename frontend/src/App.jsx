
// Por ahora lo dejo para ver como importar futuros svg
import reactLogo from './assets/img/react.svg'
import viteLogo from '/vite.svg'

// Componentes
import { Routing } from './router/Routing.jsx';

// Componente ppal
const App = () => {  

  return (
    <div className='layout'>
      
      {/* Cabecera que contiene la navegación*/}
      <Routing/>

    </div>
  )
}

export default App
