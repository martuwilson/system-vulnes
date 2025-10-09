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
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <SecuryxLogo 
              width={240} 
              height={80}
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
            Dormí Tranquilo:
            <br />
            <Box component="span" sx={{ 
              color: '#AEEA00',
              fontWeight: 900,
            }}>
              Tu PyME Está Protegida
            </Box>
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.75rem' },
              mb: { xs: 4, md: 6 },
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Nosotros nos encargamos de los hackers, 
            <Box component="span" sx={{ color: '#AEEA00', fontWeight: 600 }}>
              vos encargáte de hacer crecer tu negocio.
            </Box>
            <br />
            Protección digital 24/7 en piloto automático.
          </Typography>

          {/* Value Proposition Tagline */}
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
                py: 2,
                background: 'rgba(174, 234, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(174, 234, 0, 0.3)',
                borderRadius: '50px',
                mb: 4
              }}
            >
              <Stack direction="column" spacing={1} alignItems="center">
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#AEEA00',
                    fontSize: '1rem'
                  }}
                >
                  ✓ Sin instalaciones complicadas • ✓ Alertas en español que entendés • ✓ Soporte humano (no bots)
                </Typography>
              </Stack>
            </Box>
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
                backgroundColor: '#AEEA00',
                color: '#1E2A38',
                boxShadow: '0 8px 32px rgba(174, 234, 0, 0.4)',
                borderRadius: '50px',
                minWidth: '240px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(174, 234, 0, 0.6)',
                  backgroundColor: '#9ED600',
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
          <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                Sin tarjeta de crédito
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                14 días gratis
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
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
