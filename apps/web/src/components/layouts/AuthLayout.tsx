import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Lock, Verified } from '@mui/icons-material';
import SecuryxLogo from '../common/SecuryxLogo';

export function AuthLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E2A38 0%, #0D47A1 50%, #1E2A38 100%)',
        backgroundAttachment: 'fixed',
        px: 2,
        py: { xs: 3, md: 0 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(174, 234, 0, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0, 184, 217, 0.06) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: isMobile ? 3 : 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2), 0 16px 32px rgba(30, 42, 56, 0.3)',
            maxWidth: isMobile ? '100%' : '440px',
            mx: 'auto'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: isMobile ? 3 : 4,
            }}
          >
            {/* Logo */}
            <Box sx={{ mb: 3 }}>
              <SecuryxLogo 
                width={isMobile ? 180 : 220} 
                height={isMobile ? 54 : 66}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                }}
              />
            </Box>

            {/* Security Badge */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(174, 234, 0, 0.1)',
                px: 2,
                py: 1,
                borderRadius: 2,
                border: '1px solid rgba(174, 234, 0, 0.2)',
                mb: 2
              }}
            >
              <Lock sx={{ fontSize: 16, color: '#1E2A38' }} />
              <Typography
                variant="caption"
                sx={{ 
                  color: '#1E2A38',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                🔒 Conexión SSL Segura
              </Typography>
            </Box>
            
            <Typography
              variant="h5"
              component="h1"
              fontWeight={700}
              textAlign="center"
              sx={{ 
                color: '#1E2A38',
                mb: 1,
                fontSize: isMobile ? '1.5rem' : '1.75rem'
              }}
            >
              Acceder a mi cuenta
            </Typography>
            
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ 
                color: 'text.secondary',
                maxWidth: 320,
                lineHeight: 1.5,
                fontSize: '0.95rem'
              }}
            >
              Protección digital confiable para tu PyME
            </Typography>
          </Box>

          {/* Content */}
          <Outlet />

          {/* Security Assurance */}
          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: 3,
              mb: 4,
              p: 2,
              bgcolor: 'rgba(0, 184, 217, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(0, 184, 217, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Verified sx={{ fontSize: 16, color: '#00B8D9' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#1E2A38',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                Tu información se cifra de extremo a extremo
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                lineHeight: 1.4
              }}
            >
              Cumplimos con estándares internacionales de seguridad y privacidad
            </Typography>
          </Box>

          {/* CTA Registration */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ color: 'text.secondary', fontSize: '0.9rem' }}
            >
              ¿Primera vez en Securyx?{' '}
              <Typography 
                component="span" 
                sx={{ 
                  color: '#AEEA00',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { 
                    color: '#00B8D9',
                    textDecoration: 'underline'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
                Creá tu cuenta gratis
              </Typography>
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              © 2025 Securyx Pyme. Tu tranquilidad digital es nuestra prioridad.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
