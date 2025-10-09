import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SecuryxLogo from '../common/SecuryxLogo';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      id="home"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
        color: 'white',
        pt: { xs: 14, md: 18 },
        pb: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.06) 0%, transparent 60%),
            radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.04) 0%, transparent 50%)
          `,
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.06))',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Logo Securyx */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
            <SecuryxLogo 
              width={200} 
              height={60}
              style={{
                filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.1))',
              }}
            />
          </Box>
          
          {/* Modern Typography Hierarchy */}
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
              lineHeight: { xs: 1.1, md: 1.05 },
              mb: { xs: 3, md: 4 },
              letterSpacing: { xs: '-0.02em', md: '-0.04em' },
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
              maxWidth: '900px',
              mx: 'auto'
            }}
          >
            Tu Negocio Protegido,
            <br />
            <Box component="span" sx={{ 
              color: '#B8FF00',
              fontWeight: 900,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}>
              Tu Mente Tranquila
            </Box>
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: { xs: 4, md: 5 },
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
              maxWidth: '750px',
              mx: 'auto',
            }}
          >
            Nosotros vigilamos las amenazas digitales, 
            <Box component="span" sx={{ color: '#B8FF00', fontWeight: 600, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              vos te enfocás en hacer crecer tu empresa.
            </Box>
            <br />
            Seguridad automática que funciona sola.
          </Typography>

          {/* Value Proposition Tagline */}
          <Box sx={{ mb: { xs: 5, md: 6 } }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 4 }} 
              justifyContent="center" 
              alignItems="center"
              sx={{
                px: 4,
                py: 3,
                background: 'rgba(184, 255, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(184, 255, 0, 0.2)',
                borderRadius: '24px',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#B8FF00',
                    fontSize: '0.95rem',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  ✓ Setup simple
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#B8FF00',
                    fontSize: '0.95rem',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  ✓ Alertas claras
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#B8FF00',
                    fontSize: '0.95rem',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  ✓ Soporte real
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: '#B8FF00',
                color: '#1E2A38',
                boxShadow: '0 8px 32px rgba(184, 255, 0, 0.4)',
                borderRadius: '50px',
                minWidth: '240px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(184, 255, 0, 0.6)',
                  backgroundColor: '#A6E600',
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              Proteger Mi Negocio Gratis
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: '#00B8D9',
                color: '#00B8D9',
                borderRadius: '50px',
                minWidth: '200px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#00B8D9',
                  backgroundColor: 'rgba(0, 184, 217, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Ver Cómo Funciona
            </Button>
          </Stack>

          {/* Trust Indicators */}
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#B8FF00', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, fontSize: '0.9rem' }}>
                Sin tarjeta de crédito
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#B8FF00', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, fontSize: '0.9rem' }}>
                14 días gratis
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#B8FF00', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, fontSize: '0.9rem' }}>
                Soporte en español
              </Typography>
            </Box>
          </Stack>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#F5F5F5',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            Más de 500 dueños de PyMEs argentinas ya duermen tranquilos con Securyx
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
