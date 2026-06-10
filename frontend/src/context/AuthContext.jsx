import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await API.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();

    // Load admin if token exists
    const adminToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminUser');
    if (adminToken && storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { token, user: loggedUser } = response.data;
        localStorage.setItem('token', token);
        setUser(loggedUser);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (businessName, email, password) => {
    try {
      const response = await API.post('/auth/register', { businessName, email, password });
      if (response.data?.success) {
        const { token, user: registeredUser } = response.data;
        localStorage.setItem('token', token);
        setUser(registeredUser);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try a different email.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await API.post('/admin/auth/login', { email, password });
      if (response.data?.success) {
        const { token, admin: loggedAdmin } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(loggedAdmin));
        setAdmin(loggedAdmin);
        return { success: true };
      }
      return { success: false, message: 'Invalid admin credentials' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed.',
      };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  const refreshUser = async () => {
    try {
      const response = await API.get('/auth/me');
      if (response.data?.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error refreshing user details:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        register,
        logout,
        adminLogin,
        adminLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
