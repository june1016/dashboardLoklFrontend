// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces para los tipos de datos
interface SubscriptionStatusData {
  name: string;
  value: number;
  description: string;
}

interface User {
  name: string;
  role: string;
  email: string;
}

// Interface para el contexto
interface AppContextType {
  user: User | null;
  subscriptionStatuses: SubscriptionStatusData[];
  loading: boolean;
  setUser: (user: User | null) => void;
}

// Valor por defecto del contexto
const AppContext = createContext<AppContextType>({
  user: null,
  subscriptionStatuses: [],
  loading: true,
  setUser: () => {},
});

// Hook para usar el contexto
export const useAppContext = () => useContext(AppContext);

// Proveedor del contexto
export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionStatuses, setSubscriptionStatuses] = useState<SubscriptionStatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos la carga de datos iniciales
    setTimeout(() => {
      setUser({
        name: 'Juan Esteban',
        role: 'Administrador',
        email: 'juan.Esteban@example.com'
      });
      
      setSubscriptionStatuses([
        { name: 'Activas', value: 145, description: 'Suscripciones actualmente en curso' },
        { name: 'Finalizando Pronto', value: 38, description: 'Suscripciones con 3 cuotas o menos restantes' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const value = {
    user,
    subscriptionStatuses,
    loading,
    setUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};