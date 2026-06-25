/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('registeredUsers');
    // Default mock user if empty
    return saved ? JSON.parse(saved) : [{
      name: 'Neenu Sharma',
      email: 'admin@eedara.com',
      mobile: '9030423317',
      password: 'password123',
      address: '123 Luxury Avenue, Banjara Hills',
      pincode: '500034'
    }];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Remove password before saving to session state
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = (name, email, mobile, password) => {
    const exists = registeredUsers.some(u => u.email === email);
    if (exists) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser = { name, email, mobile, password };
    setRegisteredUsers(prev => [...prev, newUser]);

    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateMeasurements = (measurements) => {
    if (!user) return { success: false, message: 'No user logged in' };

    // Update logged-in user state
    const updatedUser = { ...user, measurements };
    setUser(updatedUser);

    // Update registeredUsers array in state and localStorage
    setRegisteredUsers(prev => prev.map(u => {
      if (u.email === user.email) {
        return { ...u, measurements };
      }
      return u;
    }));

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateMeasurements }}>
      {children}
    </AuthContext.Provider>
  );
};
