import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurer la session depuis localStorage au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('tc_token');
    const storedUser  = localStorage.getItem('tc_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData) => {
    localStorage.setItem('tc_token', tokenVal);
    localStorage.setItem('tc_user',  JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('tc_token');
    localStorage.removeItem('tc_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin    = user?.role === 'admin';
  const isCompany  = user?.type === 'company';
  const isCandidat = user?.type === 'user' && user?.role !== 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isCompany, isCandidat }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
};
