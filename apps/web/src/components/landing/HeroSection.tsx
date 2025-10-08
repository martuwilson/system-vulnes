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
            <SecuryxLogo height={70} />
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
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
              maxWidth: '900px',
              mx: 'auto'
            }}
          >
            Protección Digital
            <br />
            <Box component="span" sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Inteligente
            </Box>
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.75rem' },
              mb: { xs: 4, md: 6 },
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.6,
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Monitoreo continuo de vulnerabilidades para PyMEs. 
            <Box component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>
              Prevención automática
            </Box> de brechas de seguridad.
          </Typography>

          {/* Value Proposition Tagline */}
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
                py: 2,
                background: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '50px',
                mb: 4
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: '#93c5fd',
                  fontSize: '1.1rem'
                }}
              >
                ⚡ Setup en 5 minutos • 🛡️ Protección 24/7 • 🎯 Resultados instantáneos
              </Typography>
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                borderRadius: '50px',
                minWidth: '200px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              Empezar Gratis Ahora
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '50px',
                minWidth: '200px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Ver Demo en Vivo
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
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.9rem'
            }}
          >
            Únete a +500 empresas argentinas que ya protegen su infraestructura digital
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
