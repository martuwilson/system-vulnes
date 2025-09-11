import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { from } from '@apollo/client';
import toast from 'react-hot-toast';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  
  // Debug: verificar si el token existe
  if (token) {
    console.log('🔑 Token found, sending in headers');
  } else {
    console.log('❌ No token found in localStorage');
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Si el error es de autenticación, limpiar tokens y redirigir al login
      if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Unauthorized')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        
        // Redirigir al login si no estamos ya ahí
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    });
  }
  
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    
    // Si es un error 401, también manejar como error de autenticación
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      
      toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
