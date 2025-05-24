"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";

// Define la estructura de datos para el usuario
// interface User {
//   : string;
// }

// Define la estructura del contexto de autenticación
interface AuthContextType {
  loginUser: (userData: string, authToken: string, rol: string) => void;
  logoutUser: () => void;
  getUser: () => string | null;
  getToken: () => string | null;
  getCookieValue: (name:string) => any;
}

// Crea el contexto con un tipo genérico
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define las props para el proveedor de autenticación
interface AuthProviderProps {
  children: ReactNode;
}
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; samesite=none; secure`;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const loginUser = (userData: string, authToken: string, rol: string) => {

    // Guarda el token en una cookie para acceso del middleware
    const maxAge = 21600; // 21600 segundos = 6 horas
    document.cookie = `token=${authToken}; path=/; secure; samesite=none; max-age=${maxAge}`;
    document.cookie = `rol=${rol}; path=/; secure; samesite=none; max-age=${maxAge}`;
    
  
    // Guarda en localStorage (solo para uso del cliente)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('user', JSON.stringify(userData));
      window.localStorage.setItem('token', authToken);
      window.localStorage.setItem('rol', JSON.stringify(rol));
    }

  };

  const logoutUser = () => {

    if (global?.window !== undefined) {
      // Solo se ejecutará en el cliente
      window?.localStorage?.clear();
    }
    deleteCookie('token');
    deleteCookie('rol');
  };

  const getUser = () => {
    if (typeof window !== 'undefined') {
      const user = window.localStorage.getItem('user');
      return user ? JSON.parse(user) : {}
    }
    return null;
    
  }
  
  const getToken = () => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');
      return token;
    }
    return null;
  }

  const getCookieValue = (name:string)  => {
    const cookies = document.cookie.split('; '); // Divide las cookies por '; ' en un array
    for (const cookie of cookies) {
        const [key, value] = cookie.split('='); // Divide cada cookie en clave y valor
        if (key === name) {
            return value; // Devuelve el valor si el nombre coincide
        }
    }
    return null; // Devuelve null si no se encuentra la cookie
  }

  return (
    <AuthContext.Provider value={{ loginUser, logoutUser, getUser, getToken, getCookieValue }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
