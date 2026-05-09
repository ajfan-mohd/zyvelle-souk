import React, { createContext, useContext, useState, useEffect } from 'react';

interface SecurityContextType {
  csrfToken: string | null;
  fetchCsrfToken: () => Promise<void>;
  isLoading: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('/api/csrf-token');
      const data = await response.json();
      setCsrfToken(data.token);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <SecurityContext.Provider value={{ csrfToken, fetchCsrfToken, isLoading }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}
