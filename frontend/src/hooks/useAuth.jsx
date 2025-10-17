// PROPORCIONO EL CONTEXTO AUTHCONTEXT
import React, { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

// Componente
const useAuth = () => {
    return useContext(AuthContext)
}

export default useAuth;

