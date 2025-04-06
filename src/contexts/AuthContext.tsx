
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const savedUser = localStorage.getItem('eazyquizz_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string) => {
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const mockUser = {
        id: '123',
        name: role === 'teacher' ? 'Teacher Name' : 'Student Name',
        email,
        role: role as 'teacher' | 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('eazyquizz_user', JSON.stringify(mockUser));
      toast.success(`Logged in successfully as ${mockUser.name}`);
      return true;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const mockUser = {
        id: '123',
        name,
        email,
        role: role as 'teacher' | 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('eazyquizz_user', JSON.stringify(mockUser));
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eazyquizz_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        logout
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
