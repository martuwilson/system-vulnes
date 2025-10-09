import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const schema = yup.object({
  email: yup
    .string()
    .required('Email es requerido')
    .email('Email debe ser válido'),
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true);
    setError(null);

    try {
      const result = await login(data.email, data.password);
      
      if (!result?.success) {
        setError(result?.error || 'Error al iniciar sesión');
      }
    } catch (err: any) {
      console.error('Login exception:', err);
      setError(err.message || 'Error inesperado');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography
        variant="h5"
        component="h2"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Iniciar Sesión
      </Typography>
      
      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Accede a tu panel de seguridad digital
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color={errors.email ? 'error' : 'action'} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color={errors.password ? 'error' : 'action'} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
        )}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoggingIn}
        sx={{ mb: 2, py: 1.5 }}
      >
        {isLoggingIn ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Iniciar Sesión'
        )}
      </Button>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          ¿Primera vez en Securyx?{' '}
          <MuiLink
            component={Link}
            to="/auth/register"
            sx={{ 
              color: '#AEEA00',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { 
                color: '#00B8D9',
                textDecoration: 'underline'
              },
              transition: 'color 0.3s ease'
            }}
          >
            Creá tu cuenta gratis
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
