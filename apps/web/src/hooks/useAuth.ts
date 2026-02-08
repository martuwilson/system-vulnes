import { useState, useEffect, useCallback } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import toast from 'react-hot-toast';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        subscription {
          id
          plan
          status
          currentPeriodStart
          currentPeriodEnd
        }
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        subscription {
          id
          plan
          status
          currentPeriodStart
          currentPeriodEnd
        }
      }
    }
  }
`;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscription?: {
    id: string;
    plan: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const apolloClient = useApolloClient();

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Enviando request de login a GraphQL...');
      console.log('📧 Email:', email);
      console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001/graphql');
      
      const { data } = await loginMutation({
        variables: { 
          input: { email, password }
        },
      });

      console.log('📥 Respuesta del servidor:', data);

      if (data?.login) {
        const { accessToken, user } = data.login;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        });

        toast.success('¡Bienvenido de vuelta!');
        
        // Redirigir correctamente después del login
        setTimeout(() => {
          if (window.location.pathname.startsWith('/auth')) {
            window.location.href = '/app/dashboard';
          }
        }, 100);
        
        return { success: true };
      } else {
        return { success: false, error: 'No se recibieron datos de login' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.message || 'Error al iniciar sesión';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [loginMutation]);

  const register = useCallback(async (input: {
    name: string;
    email: string;
    password: string;
    companyName: string;
    companyDomain: string;
  }) => {
    try {
      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        const { accessToken, user } = data.register;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
        });

        toast.success('¡Cuenta creada exitosamente!');
        return { success: true };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.message || 'Error al registrar usuario';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [registerMutation]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    // Clear Apollo cache
    apolloClient.clearStore();
    
    toast.success('Sesión cerrada');
  }, [apolloClient]);

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
