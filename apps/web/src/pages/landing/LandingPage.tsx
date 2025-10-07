import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Alert
} from '@mui/material';
import { 
  Security, 
  Shield, 
  Speed, 
  Analytics, 
  CheckCircle, 
  ArrowForward,
  Email,
  Business,
  Https,
  NetworkCheck,
  BugReport,
  Star,
  ExpandMore,
  Send,
  Phone,
  Verified,
  TrendingUp,
  Lock,
  AttachMoney,
  LocalFireDepartment,
  Cancel,
  BarChart,
  FlashOn,
  AccountBalance,
  Terminal,
  Code,
  DataObject,
  Memory,
  Api,
  Storage,
  DeveloperMode,
  IntegrationInstructions,
  Webhook,
  Integration
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SecuryxLogo from '../../components/common/SecuryxLogo';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Terminal sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Escaneo Completo de Protección Digital',
      description: 'Análisis automatizado de SSL, DNS, headers de seguridad y puertos abiertos ejecutado desde terminal especializado'
    },
    {
      icon: <Api sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'API REST en Tiempo Real',
      description: 'Procesamiento asíncrono con colas Redis y APIs GraphQL para escaneos rápidos y eficientes'
    },
    {
      icon: <BarChart sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Dashboard con Métricas Avanzadas',
      description: 'Visualización de datos con charts interactivos, health score y gestión centralizada de vulnerabilidades'
    },
    {
      icon: <Storage sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Base de Datos Persistente',
      description: 'Almacenamiento en PostgreSQL con histórico completo y supervisión 24/7 de tus dominios'
    }
  ];

  const scanTypes = [
    { icon: <Integration />, name: 'Email Security', description: 'SPF, DKIM, DMARC' },
    { icon: <Https />, name: 'SSL Certificate', description: 'Validez y expiración' },
    { icon: <Webhook />, name: 'Security Headers', description: 'HSTS, CSP, X-Frame' },
    { icon: <Terminal />, name: 'Port Scanner', description: 'Puertos críticos abiertos' }
  ];

  return (
    <Box>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '85vh', md: '80vh' },
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
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <SecuryxLogo height={60} />
            </Box>
            
            {/* Modern Typography Hierarchy */}
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                lineHeight: { xs: 1.1, md: 1.05 },
                mb: { xs: 2, md: 3 },
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
                letterSpacing: '0.01em'
              }}
            >
              Detectamos vulnerabilidades, fortalecemos defensas y protegemos tu PyME 
              con tecnología de vanguardia y simplicidad argentina.
            </Typography>
            
            {/* Value Proposition Tagline */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '50px',
                px: 4,
                py: 2,
                mb: { xs: 6, md: 8 }
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }}
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              >
                Tu seguridad digital, sin complicaciones
              </Typography>
            </Box>
          </Box>
          
          {/* Modern Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 8, maxWidth: '900px', mx: 'auto' }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  fontWeight={700} 
                  sx={{ 
                    color: '#fbbf24',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  76%
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500
                  }}
                >
                  de PyMEs sufren ataques digitales
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  fontWeight={700} 
                  sx={{ 
                    color: '#ef4444',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  $4.88M
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500
                  }}
                >
                  costo promedio por brecha
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <Typography 
                  variant="h3" 
                  fontWeight={700} 
                  sx={{ 
                    color: '#10b981',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  5min
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500
                  }}
                >
                  para proteger tu empresa
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Modern CTA Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" sx={{ mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/auth/register')}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                px: 8,
                py: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '50px',
                textTransform: 'none',
                letterSpacing: '0.5px',
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 50px rgba(59, 130, 246, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Empezar Gratis Ahora
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Phone />}
              onClick={() => navigate('/contact')}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                px: 8,
                py: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '50px',
                textTransform: 'none',
                letterSpacing: '0.5px',
                '&:hover': { 
                  borderColor: 'rgba(255, 255, 255, 0.4)', 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(255, 255, 255, 0.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Solicitar Demo
            </Button>
          </Stack>

          {/* Trust Indicators */}
          <Box sx={{ textAlign: 'center', opacity: 0.8, mb: 8 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2,
                fontWeight: 500
              }}
            >
              ✓ Sin tarjeta de crédito ✓ 14 días gratis ✓ Soporte en español
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 400
              }}
            >
              Más de 150 PyMEs ya confían en nosotros
            </Typography>
          </Box>

          {/* Live Metrics & Social Proof */}
          <Box 
            sx={{ 
              textAlign: 'center',
              mb: 6,
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 3,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.75rem'
              }}
            >
              Métricas en vivo
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    sx={{ 
                      color: '#10b981',
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    2,847
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Vulnerabilidades detectadas hoy
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#10b981', 
                      borderRadius: '50%', 
                      mx: 'auto', 
                      mt: 1,
                      boxShadow: '0 0 10px #10b981',
                      animation: 'pulse 2s infinite'
                    }} 
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    sx={{ 
                      color: '#3b82f6',
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    156
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Empresas protegidas activamente
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#3b82f6', 
                      borderRadius: '50%', 
                      mx: 'auto', 
                      mt: 1,
                      boxShadow: '0 0 10px #3b82f6',
                      animation: 'pulse 2s infinite'
                    }} 
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    sx={{ 
                      color: '#f59e0b',
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    99.7%
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Tiempo de actividad este mes
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      bgcolor: '#f59e0b', 
                      borderRadius: '50%', 
                      mx: 'auto', 
                      mt: 1,
                      boxShadow: '0 0 10px #f59e0b',
                      animation: 'pulse 2s infinite'
                    }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Trusted By Logos */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                mb: 4,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: '0.75rem'
              }}
            >
              Confiado por empresas líderes
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={6} 
              justifyContent="center" 
              alignItems="center"
              sx={{ opacity: 0.6 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Business sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  MercadoLibre
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Business sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Globant
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Business sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Despegar
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Business sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                  Auth0
                </Typography>
              </Box>
            </Stack>
          </Box>

        </Container>
      </Box>

      {/* Tech Stack Section */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                mb: 2
              }}
            >
              Stack Tecnológico
            </Typography>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                mb: 3
              }}
            >
              Tecnologías de Última Generación
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Construido con las mejores herramientas y frameworks del ecosistema moderno
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2,
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.2)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Api sx={{ color: '#3b82f6', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  GraphQL API
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(16, 185, 129, 0.2)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Storage sx={{ color: '#10b981', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  PostgreSQL
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2,
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(239, 68, 68, 0.2)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <FlashOn sx={{ color: '#ef4444', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Redis Queue
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2,
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(245, 158, 11, 0.2)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Code sx={{ color: '#f59e0b', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  TypeScript
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2,
                    bgcolor: 'rgba(139, 69, 193, 0.1)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(139, 69, 193, 0.2)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Terminal sx={{ color: '#8b45c1', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Node.js
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 2,
                    bgcolor: 'rgba(6, 182, 212, 0.1)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(6, 182, 212, 0.2)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Webhook sx={{ color: '#06b6d4', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Prisma ORM
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
              💻 Arquitectura moderna • 🚀 Escalable • 🔒 Seguro por diseño
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box 
        sx={{ 
          py: 12, 
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#3b82f6',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2
              }}
            >
              Proceso Simplificado
            </Typography>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Cómo Funciona Securyx
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Protección digital empresarial en 3 pasos simples, sin complicaciones técnicas
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="stretch">
            {/* Step 1 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    '& .step-number': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 12px 32px rgba(239, 68, 68, 0.4)'
                    }
                  }
                }}
              >
                {/* Background Decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }}
                />

                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box 
                    className="step-number"
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'white' }}>1</Typography>
                  </Box>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                    Conectá tus Dominios
                  </Typography>
                  
                  <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Simplemente ingresá las URLs de tu empresa. Sin instalaciones, sin código, sin complicaciones técnicas.
                  </Typography>

                  {/* Example URLs */}
                  <Box 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(59, 130, 246, 0.05)', 
                      borderRadius: 2,
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)'
                      }}
                    />
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600 }}>
                          tuempresa.com.ar
                        </Typography>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600 }}>
                          tienda.tuempresa.com
                        </Typography>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600 }}>
                          mail.tuempresa.com
                        </Typography>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Step 2 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(59, 130, 246, 0.2)',
                    '& .step-number': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)'
                    }
                  }
                }}
              >
                {/* Background Decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }}
                />

                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box 
                    className="step-number"
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'white' }}>2</Typography>
                  </Box>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                    Escaneamos Todo
                  </Typography>
                  
                  <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Nuestros robots analizan SSL, DNS, headers de seguridad, puertos y configuraciones críticas 24/7.
                  </Typography>

                  {/* Security Badges */}
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(16, 185, 129, 0.1)', 
                          borderRadius: 2,
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(16, 185, 129, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Https sx={{ color: '#10b981', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          SSL/TLS
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(245, 158, 11, 0.1)', 
                          borderRadius: 2,
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(245, 158, 11, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Email sx={{ color: '#f59e0b', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          Email Sec
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(139, 69, 193, 0.1)', 
                          borderRadius: 2,
                          border: '1px solid rgba(139, 69, 193, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(139, 69, 193, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Webhook sx={{ color: '#8b45c1', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          Headers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(239, 68, 68, 0.1)', 
                          borderRadius: 2,
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'rgba(239, 68, 68, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Code sx={{ color: '#ef4444', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          Puertos
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* Step 3 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.2)',
                    '& .step-number': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)'
                    }
                  }
                }}
              >
                {/* Background Decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }}
                />

                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box 
                    className="step-number"
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'white' }}>3</Typography>
                  </Box>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                    Actuás con Confianza
                  </Typography>
                  
                  <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Recibís alertas inmediatas + recomendaciones específicas + reportes PDF para implementar.
                  </Typography>

                  {/* Alert Example */}
                  <Box 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(16, 185, 129, 0.05)', 
                      borderRadius: 2,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      position: 'relative',
                      textAlign: 'left'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: '#f59e0b',
                          animation: 'pulse 2s infinite'
                        }} 
                      />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        🚨 SSL vence en 7 días
                      </Typography>
                    </Box>
                    
                    <Box sx={{ pl: 3, borderLeft: '2px solid #10b981' }}>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        <strong>Acción recomendada:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                        → Renovar con tu proveedor hosting
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                        → Guía paso a paso incluida
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Connecting Lines - Only visible on desktop */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: 2,
              mt: -1
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #ef4444 0%, #3b82f6 50%, #10b981 100%)',
                borderRadius: 1,
                opacity: 0.3
              }}
            />
          </Box>

          {/* ROI Guarantee Section */}
          <Box sx={{ mt: 12 }}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 6,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}
              />

              <Box sx={{ position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <TrendingUp sx={{ fontSize: 40 }} />
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    📈 Garantía de ROI
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                  Si no mejoramos tu seguridad en 30 días, te devolvemos tu dinero.
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'inline-block',
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    💰 Promedio: las empresas ahorran <strong>$2,840 USD</strong> en su primer mes evitando una sola brecha
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#3b82f6',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2
              }}
            >
              Capacidades Principales
            </Typography>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              ¿Por qué Elegir Securyx?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Protección digital empresarial diseñada específicamente para PyMEs argentinas
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        filter: 'brightness(1.2)'
                      },
                      '& .feature-gradient': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  {/* Hover Gradient Effect */}
                  <Box
                    className="feature-gradient"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  
                  {/* Content */}
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                        mb: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <Box sx={{ color: 'white', fontSize: '2rem' }}>
                        {feature.icon}
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 2,
                        fontSize: '1.25rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      sx={{ 
                        color: '#64748b',
                        lineHeight: 1.7,
                        fontSize: '1rem'
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Feature Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Call to Action within Features */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                mb: 4,
                fontWeight: 500
              }}
            >
              ¿Listo para proteger tu empresa?
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
                }
              }}
            >
              Comenzar Prueba Gratuita
              <ArrowForward sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', 
          color: 'white', 
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#10b981',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2
              }}
            >
              Testimonios Reales
            </Typography>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              PyMEs que Transformaron su Seguridad
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Casos reales de empresas argentinas que mejoraron su protección digital con Securyx
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Testimonial 1 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                {/* Verified Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Verified sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    VERIFICADO
                  </Typography>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                  <Rating 
                    value={5} 
                    readOnly 
                    size="small" 
                    sx={{ 
                      color: '#fbbf24',
                      '& .MuiRating-iconFilled': {
                        color: '#fbbf24'
                      }
                    }} 
                  />
                  <Typography variant="body2" sx={{ ml: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    5.0 • hace 2 semanas
                  </Typography>
                </Box>

                {/* Quote */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    fontStyle: 'italic',
                    color: 'white',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    position: 'relative'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      left: -16,
                      top: -8,
                      fontSize: '3rem',
                      color: 'rgba(16, 185, 129, 0.3)',
                      fontFamily: 'serif'
                    }}
                  >
                    "
                  </Box>
                  Detectamos 12 vulnerabilidades críticas que no sabíamos que teníamos. En 2 semanas mejoramos nuestro Health Score de 45% a 87%. El ROI fue inmediato.
                </Typography>

                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
                      mr: 3,
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    MG
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                      María González
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      CEO, Consultora Integral SRL
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Cliente desde hace 8 meses
                    </Typography>
                  </Box>
                </Box>

                {/* Results Badge */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                    📈 Mejora del Health Score: +42 puntos
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Testimonial 2 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                {/* Verified Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Verified sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    VERIFICADO
                  </Typography>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                  <Rating value={5} readOnly size="small" sx={{ color: '#fbbf24' }} />
                  <Typography variant="body2" sx={{ ml: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    5.0 • hace 1 mes
                  </Typography>
                </Box>

                {/* Quote */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    fontStyle: 'italic',
                    color: 'white',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    position: 'relative'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      left: -16,
                      top: -8,
                      fontSize: '3rem',
                      color: 'rgba(16, 185, 129, 0.3)',
                      fontFamily: 'serif'
                    }}
                  >
                    "
                  </Box>
                  Antes pagábamos $200 USD/mes a un consultor. Ahora con Securyx tenemos monitoreo 24/7 por solo $29/mes. El ahorro es increíble y la cobertura mucho mejor.
                </Typography>

                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                      mr: 3,
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    CM
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                      Carlos Mendez
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      CTO, TechnoSoft Argentina
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Cliente desde hace 6 meses
                    </Typography>
                  </Box>
                </Box>

                {/* Results Badge */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                    💰 Ahorro mensual: $171 USD (-85%)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Testimonial 3 */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                {/* Verified Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Verified sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    VERIFICADO
                  </Typography>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                  <Rating value={5} readOnly size="small" sx={{ color: '#fbbf24' }} />
                  <Typography variant="body2" sx={{ ml: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                    5.0 • hace 3 semanas
                  </Typography>
                </Box>

                {/* Quote */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    fontStyle: 'italic',
                    color: 'white',
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    position: 'relative'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      left: -16,
                      top: -8,
                      fontSize: '3rem',
                      color: 'rgba(16, 185, 129, 0.3)',
                      fontFamily: 'serif'
                    }}
                  >
                    "
                  </Box>
                  Sin conocimientos técnicos pude configurar el monitoreo de nuestros 3 dominios. Los reportes PDF son perfectos para mostrar al directorio los avances.
                </Typography>

                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                      mr: 3,
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    AR
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                      Ana Rodríguez
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Gerente IT, Comercial del Norte
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Cliente desde hace 4 meses
                    </Typography>
                  </Box>
                </Box>

                {/* Results Badge */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                    ⚡ Setup time: 15 minutos vs 2 días
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Social Proof */}
          <Box sx={{ mt: 10 }}>
            {/* Overall Stats */}
            <Box
              sx={{
                textAlign: 'center',
                p: 6,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                mb: 8
              }}
            >
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                4.9/5 ⭐
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}>
                Calificación promedio de 247 reseñas verificadas
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 700 }}>
                    96%
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Tasa de retención
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                    15min
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Setup promedio
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                    24/7
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Soporte en español
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Trust Badges */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  mb: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.75rem'
                }}
              >
                Certificaciones y Cumplimiento
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={4} 
                justifyContent="center" 
                alignItems="center"
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Verified sx={{ color: '#10b981', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      ISO 27001
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Certified Security
                    </Typography>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <DeveloperMode sx={{ color: '#3b82f6', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      SOC 2
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Type II Compliant
                    </Typography>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Lock sx={{ color: '#f59e0b', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      GDPR
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Privacy Ready
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Interactive Demo Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#3b82f6',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2
              }}
            >
              Demo en Vivo
            </Typography>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Ve Securyx en Acción
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 6
              }}
            >
              Simulación interactiva de un escaneo completo de seguridad
            </Typography>
          </Box>

          <Grid container spacing={6} alignItems="center">
            {/* Left Side - Demo Controls */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  🎯 Escanear tu Sitio Web
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontWeight: 500 }}>
                    Ingresa tu dominio para ver una demo:
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="ejemplo: miempresa.com"
                    variant="outlined"
                    defaultValue="demo.securyx.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(59, 130, 246, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(59, 130, 246, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                        }
                      }
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    mb: 4,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                >
                  🚀 Iniciar Escaneo Demo
                </Button>

                {/* Quick Stats */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                        ~30s
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#064e3b' }}>
                        Tiempo de escaneo
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                        15+
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#1e3a8a' }}>
                        Checks de seguridad
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Side - Simulated Dashboard */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Dashboard Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    🛡️ Securyx Dashboard - demo.securyx.com
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Último escaneo: hace 2 minutos
                  </Typography>
                </Box>

                {/* Dashboard Content */}
                <Box sx={{ p: 3 }}>
                  {/* Health Score */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        Health Score
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                        87%
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        height: 8, 
                        bgcolor: 'rgba(255, 255, 255, 0.1)', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: '87%', 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                          transition: 'width 2s ease'
                        }} 
                      />
                    </Box>
                  </Box>

                  {/* Security Checks */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.2)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                            SSL Certificate
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Válido hasta 2026
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(239, 68, 68, 0.2)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ef4444' }} />
                          <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                            Security Headers
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          2 headers faltantes
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.2)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                            DNS Configuration
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Configuración óptima
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(245, 158, 11, 0.2)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                          <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                            Open Ports
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Puerto 22 abierto
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Scanning Animation */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: '#3b82f6',
                          animation: 'pulse 1.5s infinite'
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                        Escaneando vulnerabilidades OWASP...
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Floating Actions */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Chip
                  label="📊 Ver Reporte Completo"
                  sx={{
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' }
                  }}
                />
                <Chip
                  label="📧 Recibir por Email"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.2)' }
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Bottom CTA */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
              ¿Impresionado? Esto es solo el comienzo...
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                borderColor: '#3b82f6',
                color: '#3b82f6',
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#3b82f6',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }
              }}
            >
              Crear Mi Cuenta Gratuita
              <ArrowForward sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Scan Types Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Tipos de Escaneo
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Cobertura completa de vectores de ataque comunes
          </Typography>

          <Grid container spacing={3}>
            {scanTypes.map((scan, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {scan.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {scan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scan.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom>
              Resultados Inmediatos
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Identifica y corrige vulnerabilidades críticas en minutos, no días
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Health Score en tiempo real"
                  secondary="Métrica clara del estado de seguridad"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Recomendaciones específicas"
                  secondary="Pasos concretos para resolver cada vulnerabilidad"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Histórico de mejoras"
                  secondary="Tracking del progreso en seguridad"
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                58%
              </Typography>
              <Typography variant="h6" gutterBottom>
                Health Score Promedio
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                La mayoría de sitios web tienen vulnerabilidades críticas sin resolver
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/auth/register')}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Chequeá tu Sitio Ahora
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box 
        sx={{ 
          py: 12,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#10b981',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                mb: 2
              }}
            >
              Planes y Precios
            </Typography>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 4
              }}
            >
              Protección Profesional al Alcance de PyMEs
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 6
              }}
            >
              Elegí el plan perfecto para el tamaño y necesidades de tu empresa
            </Typography>
            
            {/* Value Proposition */}
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(255, 71, 87, 0.1)',
                backdropFilter: 'blur(10px)',
                px: 4,
                py: 2,
                borderRadius: 2,
                border: '1px solid rgba(255, 71, 87, 0.3)'
              }}
            >
              <DataObject sx={{ color: '#ff4757' }} />
              <Typography variant="body1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney sx={{ color: '#ff4757' }} />
                Ahorrá hasta $50,000 USD evitando una sola brecha
              </Typography>
            </Box>
          </Box>

          {/* Pricing Toggle */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Verified sx={{ color: '#4caf50' }} />
              Todos los planes incluyen 14 días gratis
            </Typography>
          </Box>

          {/* Pricing Cards */}
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            
            {/* Starter Plan - Most Popular */}
            <Grid item xs={12} lg={4}>
              <Card 
                elevation={8}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  bgcolor: 'white',
                  border: '3px solid #ff4757',
                  borderRadius: 3,
                  overflow: 'visible',
                  transform: { lg: 'scale(1.05)' },
                  '&:hover': { 
                    transform: { lg: 'scale(1.08)' },
                    boxShadow: '0 20px 60px rgba(255, 71, 87, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Popular Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    bgcolor: '#ff4757',
                    color: 'white',
                    px: 2.5,
                    py: 0.8,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 12px rgba(255, 71, 87, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Star fontSize="small" />
                  Popular
                </Box>

                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#333', mb: 1 }}>
                    Starter
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Perfecto para PyMEs que arrancan
                  </Typography>
                  
                  {/* Price */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h2" fontWeight={900} sx={{ color: '#ff4757' }}>
                        $29
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                        /mes
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      USD • Facturación mensual
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <LocalFireDepartment fontSize="small" />
                      Menos que un café por día
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ textAlign: 'left', mb: 4 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#2ecc71', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>1 dominio</strong> monitoreado 24/7
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#2ecc71', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Escaneos semanales</strong> automáticos
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#2ecc71', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Reportes PDF</strong> profesionales
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#2ecc71', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Alertas críticas</strong> por email
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#2ecc71', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Soporte en español</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: '#ff4757',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': { 
                        bgcolor: '#ff3742',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 71, 87, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Empezar Ahora
                  </Button>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CheckCircle fontSize="small" color="success" /> 14 días gratis • <Cancel fontSize="small" color="error" /> Sin compromiso
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Growth Plan */}
            <Grid item xs={12} lg={4}>
              <Card 
                elevation={4}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                    Growth
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Para empresas en crecimiento
                  </Typography>
                  
                  {/* Price */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h2" fontWeight={900} sx={{ color: '#ff6b35' }}>
                        $99
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                        /mes
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      USD • Facturación mensual
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ textAlign: 'left', mb: 4 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#ff6b35', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>5 dominios</strong> monitoreados
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#ff6b35', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Escaneos diarios</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#ff6b35', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Integraciones</strong> Slack/Teams
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#ff6b35', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Reportes</strong> PDF + CSV
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#ff6b35', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Usuarios ilimitados</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 107, 53, 0.1)',
                      '&:hover': { 
                        borderColor: '#ff6b35',
                        bgcolor: 'rgba(255, 107, 53, 0.2)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Elegir Growth
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Enterprise Plan */}
            <Grid item xs={12} lg={4}>
              <Card 
                elevation={4}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                    Enterprise
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Máxima protección y control
                  </Typography>
                  
                  {/* Price */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#00b4d8', mb: 1 }}>
                      Consultá
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio personalizado
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ textAlign: 'left', mb: 4 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#00b4d8', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Dominios ilimitados</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#00b4d8', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Escaneos en tiempo real</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#00b4d8', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>API personalizada</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#00b4d8', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Reportes compliance</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#00b4d8', fontSize: 20 }} />
                        <Typography variant="body1" fontWeight={500}>
                          <strong>Soporte dedicado</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<Phone />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 180, 216, 0.1)',
                      '&:hover': { 
                        borderColor: '#00b4d8',
                        bgcolor: 'rgba(0, 180, 216, 0.2)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Contactanos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Trust Indicators */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Business sx={{ color: 'rgba(255,255,255,0.9)' }} />
              Confiado por +150 PyMEs en América Latina
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={4} 
              justifyContent="center" 
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Api sx={{ color: '#2ecc71' }} />
                <Typography variant="body1" color="rgba(255,255,255,0.8)">
                  Pagos seguros con Stripe
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ color: '#2ecc71' }} />
                <Typography variant="body1" color="rgba(255,255,255,0.8)">
                  Cancelá cuando quieras
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: '#2ecc71' }} />
                <Typography variant="body1" color="rgba(255,255,255,0.8)">
                  Soporte en español 24/7
                </Typography>
              </Box>
            </Stack>

            {/* Money Back Guarantee */}
            <Box 
              sx={{ 
                mt: 6,
                p: 4,
                borderRadius: 3,
                bgcolor: 'rgba(46, 204, 113, 0.1)',
                border: '2px solid rgba(46, 204, 113, 0.3)',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              <Typography variant="h5" fontWeight={700} sx={{ color: '#2ecc71', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <AttachMoney sx={{ color: '#2ecc71' }} />
                Garantía de Satisfacción
              </Typography>
              <Typography variant="body1" color="rgba(255,255,255,0.9)">
                Si no mejoramos tu seguridad digital en 30 días, 
                te devolvemos el 100% de tu dinero. Sin preguntas.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Preguntas Frecuentes
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Resolvemos las dudas más comunes sobre protección digital para PyMEs
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Accordion elevation={2}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    ¿Qué tan difícil es implementar la solución?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Súper fácil. Solo necesitas registrarte, agregar tus dominios y listo. 
                    El primer escaneo se ejecuta automáticamente en menos de 5 minutos. 
                    No requiere instalación de software ni conocimientos técnicos.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={2}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    ¿Qué pasa si no sé interpretar los resultados?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Cada vulnerabilidad viene con explicaciones en lenguaje simple y 
                    recomendaciones específicas paso a paso. Además, ofrecemos soporte 
                    por email en español para ayudarte a implementar las mejoras.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={2}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    ¿Es seguro que escaneen mi sitio web?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Absolutamente. Solo realizamos escaneos externos (como lo haría cualquier 
                    visitante web). No accedemos a tu servidor ni datos internos. 
                    Cumplimos con estándares internacionales de seguridad y privacidad.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion elevation={2}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    ¿Cuánto tiempo toma ver resultados?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    El primer escaneo completo toma entre 3-10 minutos dependiendo del tamaño 
                    de tu sitio. Los escaneos posteriores son más rápidos (1-3 min). 
                    Recibes notificaciones inmediatas si detectamos algo crítico.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={2}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    ¿Puedo cancelar cuando quiera?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Sí, sin compromisos ni penalizaciones. Puedes cancelar tu suscripción 
                    en cualquier momento desde tu panel de control. El servicio continúa 
                    hasta el final del período facturado.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion elevation={2}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    ¿Ofrecen soporte técnico en español?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    ¡Por supuesto! Todo nuestro soporte es en español. Respondemos consultas 
                    por email en menos de 24 horas. Los clientes Pro tienen soporte 
                    prioritario con respuesta en 4 horas.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact/Demo Form Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            ¿Necesitas una Demo Personalizada?
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Agenda una reunión gratuita de 15 minutos con nuestro equipo
          </Typography>

          <Card elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email empresarial"
                  variant="outlined"
                  type="email"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Empresa"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="¿Cuál es tu principal preocupación de seguridad?"
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Ej: Necesito cumplir con normativas, tuve un incidente reciente, quiero prevenir ataques..."
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Phone />}
                    sx={{ px: 4 }}
                  >
                    Solicitar Demo
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Send />}
                    sx={{ px: 4 }}
                  >
                    Enviar Consulta
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                <Lock fontSize="small" />
                <span><strong>Compromiso de privacidad:</strong> Nunca compartimos tu información. 
                Solo la usamos para brindarte el mejor servicio posible.</span>
              </Typography>
            </Alert>
          </Card>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            ¿Listo para Proteger tu Negocio?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Únete a las empresas que ya están mejorando su seguridad digital
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/auth/register')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { 
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Empezá tu Protección Gratuita
          </Button>
        </Container>
      </Box>

      {/* Resources Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700 }}>
            Recursos Gratuitos para PyMEs
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Educación continua en protección digital
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'error.main', 
                        color: 'white', 
                        mr: 2 
                      }}
                    >
                      <Shield />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Guía de Seguridad 2025
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Checklist completo de 47 puntos para proteger tu PyME. 
                    Incluye plantillas y casos reales de Argentina.
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ bgcolor: '#ff4757', '&:hover': { bgcolor: '#ff3742' } }}
                  >
                    Descargar PDF
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'warning.main', 
                        color: 'white', 
                        mr: 2 
                      }}
                    >
                      <BarChart />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Reporte Global 2025
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Estado de la protección digital en PyMEs latinoamericanas. 
                    Tendencias, costos y predicciones para 2025.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ borderColor: '#ff4757', color: '#ff4757', '&:hover': { bgcolor: 'rgba(255, 71, 87, 0.1)' } }}
                  >
                    Leer Reporte
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'success.main', 
                        color: 'white', 
                        mr: 2 
                      }}
                    >
                      <Code />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Webinar Mensual
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    "Cómo crear un plan de respuesta a incidentes". 
                    Próximo webinar: 15 de octubre, 16:00 hs ART.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="success"
                    fullWidth
                  >
                    Registrarme Gratis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Newsletter Signup */}
          <Box sx={{ mt: 6, textAlign: 'center', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              📧 Newsletter de Protección Digital
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Recibe tips semanales, alertas de vulnerabilidades y casos de estudio. Sin spam.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
              <TextField
                placeholder="tu@empresa.com.ar"
                variant="outlined"
                size="medium"
                sx={{ minWidth: 300 }}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<Send />}
                sx={{ 
                  bgcolor: '#ff4757', 
                  px: 4,
                  '&:hover': { bgcolor: '#ff3742' }
                }}
              >
                Suscribirme
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <BarChart fontSize="small" />
              Únete a 2,400+ PyMEs que ya reciben nuestro newsletter
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          {/* Trust Bar */}
          <Box sx={{ textAlign: 'center', mb: 6, pb: 4, borderBottom: '1px solid #333' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
              Certificaciones y Compliance Securyx
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Verified sx={{ color: '#2ecc71' }} />
                <Typography variant="body2">ISO 27001:2022</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Terminal sx={{ color: '#00b8d9' }} />
                <Typography variant="body2">SOC 2 Type II</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock sx={{ color: '#ffa726' }} />
                <Typography variant="body2">GDPR Compliant</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IntegrationInstructions sx={{ color: '#e91e63' }} />
                <Typography variant="body2">OWASP Aligned</Typography>
              </Box>
            </Stack>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900,
                    color: '#ff4757',
                    mb: 0.5
                  }}
                >
                  Securyx
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 300,
                    color: 'grey.500',
                    fontStyle: 'italic',
                    textAlign: 'left',
                    pl: 1
                  }}
                >
                  PyME
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400" sx={{ mb: 3 }}>
                Líder en protección digital para PyMEs en América Latina. 
                Protegé tu negocio con tecnología empresarial al alcance de todos.
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccountBalance fontSize="small" />
                  +150 empresas protegidas
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BugReport fontSize="small" />
                  +2,400 vulnerabilidades detectadas
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FlashOn fontSize="small" />
                  99.9% uptime garantizado
                </Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Producto
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Features</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Precios</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Integraciones</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>API Docs</Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Recursos
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Blog</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Guías</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Webinars</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Casos de Éxito</Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Soporte
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Centro de Ayuda</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>FAQ</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Status del Sistema</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Contacto</Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Términos de Uso</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Privacidad</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Cookies</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>SLA</Typography>
              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ borderTop: '1px solid #333', mt: 6, pt: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="grey.500">
                  © 2025 Securyx. Todos los derechos reservados. | Hecho con ❤️ en Argentina 🇦🇷
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                  <Typography variant="body2" color="grey.500">Síguenos:</Typography>
                  <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: '#ff4757' } }}>
                    LinkedIn
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: '#ff4757' } }}>
                    Twitter
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: '#ff4757' } }}>
                    YouTube
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
