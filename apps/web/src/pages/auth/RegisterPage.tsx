import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Grid,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person, 
  Business as BusinessIcon,
  Language 
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const schema = yup.object({
  name: yup
    .string()
    .required('Nombre es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: yup
    .string()
    .required('Email es requerido')
    .email('Email debe ser válido'),
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .required('Confirmar contraseña es requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
  companyName: yup
    .string()
    .required('Nombre de empresa es requerido')
    .min(2, 'Nombre de empresa debe tener al menos 2 caracteres'),
  companyDomain: yup
    .string()
    .required('Dominio de empresa es requerido')
    .matches(
      /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/,
      'Dominio debe ser válido (ejemplo: miempresa.com, www.miempresa.com.ar o https://miempresa.com)'
    )
    .transform((value) => {
      // Limpiar el dominio: remover http://, https://, www., y trailing slashes
      return value
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .toLowerCase();
    }),
});

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyDomain: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      companyDomain: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companyDomain: data.companyDomain,
      });
      
      if (result?.success) {
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Error al registrar usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
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
        Crear Cuenta
      </Typography>
      
      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Registra tu empresa y comienza a monitorear tu seguridad digital
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nombre completo"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.name ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
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
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color={errors.email ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={errors.confirmPassword ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nombre de la empresa"
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color={errors.companyName ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="companyDomain"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Dominio principal"
                placeholder="miempresa.com"
                error={!!errors.companyDomain}
                helperText={errors.companyDomain?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language color={errors.companyDomain ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Crear Cuenta'
        )}
      </Button>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          ¿Ya tenés cuenta en Securyx?{' '}
          <MuiLink
            component={Link}
            to="/auth/login"
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
            Iniciá sesión acá
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
