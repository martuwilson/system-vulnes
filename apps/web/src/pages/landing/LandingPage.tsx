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
  Https,
  NetworkCheck,
  BugReport,
  Star,
  ExpandMore,
  Send,
  Phone,
  Business,
  Verified,
  TrendingUp,
  Lock,
  AttachMoney,
  LocalFireDepartment,
  Cancel,
  BarChart,
  FlashOn,
  AccountBalance
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Escaneo Completo de Protección Digital',
      description: 'Análisis automatizado de SSL, DNS, headers de seguridad y puertos abiertos para tu tranquilidad'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Resultados en Tiempo Real',
      description: 'Procesamiento asíncrono con colas Redis para escaneos rápidos y eficientes, sin esperas'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Dashboard Intuitivo',
      description: 'Métricas claras, health score y gestión centralizada de vulnerabilidades sin complicaciones técnicas'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Monitoreo Continuo',
      description: 'Supervisión 24/7 de tus dominios con alertas automáticas que no te dejan dormir mal'
    }
  ];

  const scanTypes = [
    { icon: <Email />, name: 'Email Security', description: 'SPF, DKIM, DMARC' },
    { icon: <Https />, name: 'SSL Certificate', description: 'Validez y expiración' },
    { icon: <NetworkCheck />, name: 'Security Headers', description: 'HSTS, CSP, X-Frame' },
    { icon: <BugReport />, name: 'Port Scanner', description: 'Puertos críticos abiertos' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 71, 87, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 184, 217, 0.1) 0%, transparent 50%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Logo Securyx */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h2" 
                component="div"
                sx={{ 
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  color: 'white',
                  letterSpacing: '-0.02em',
                  mb: 0.5
                }}
              >
                Securyx
              </Typography>
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 300,
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  color: 'rgba(255,255,255,0.7)',
                  fontStyle: 'italic',
                  textAlign: 'right',
                  maxWidth: '200px',
                  mx: 'auto',
                  position: 'relative',
                  left: { xs: '20px', md: '30px' }
                }}
              >
                PyME
              </Typography>
            </Box>
            
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(135deg, #ff4757 0%, #ff6b7a 50%, #c44569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255, 71, 87, 0.3)'
              }}
            >
              DETENE LAS AMENAZAS DIGITALES
            </Typography>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                mb: 2,
                color: 'white'
              }}
            >
              Antes de que Destruyan tu PyME
            </Typography>
            
            {/* Slogan oficial */}
            <Typography 
              variant="h4" 
              component="div"
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.3rem', md: '1.8rem' },
                color: '#ff4757',
                fontStyle: 'italic',
                mb: 3,
                textShadow: '0 2px 10px rgba(255, 71, 87, 0.3)'
              }}
            >
              "Es tu protección digital, sin vueltas."
            </Typography>
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.9, 
              maxWidth: '800px', 
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              fontWeight: 400
            }}
          >
            Detección automatizada de vulnerabilidades críticas en tiempo real. 
            <Box component="span" sx={{ color: '#ff4757', fontWeight: 600 }}>
              Sin instalaciones complejas.
            </Box> Solo resultados que protegen tu negocio.
          </Typography>
          
          {/* Estadísticas impactantes */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                76%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                de PyMEs sufren ataques
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                $4.88M
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                costo promedio por brecha
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                5 min
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                para proteger tu empresa
              </Typography>
            </Box>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/auth/register')}
              sx={{
                bgcolor: '#ff4757',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4)',
                '&:hover': { 
                  bgcolor: '#ff3742',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 45px rgba(255, 71, 87, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Protegé tu PyME Gratis
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Phone />}
              onClick={() => navigate('/auth/login')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                backdropFilter: 'blur(10px)',
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(255,255,255,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Solicitá tu Demo
            </Button>
          </Stack>

        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700 }}>
            Cómo Funciona Securyx
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Protección digital empresarial en 3 pasos simples
          </Typography>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: '#ff4757', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(255, 71, 87, 0.3)'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" color="white">1</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Conecta tus Dominios
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Simplemente ingresa las URLs de tu empresa. Sin instalaciones, sin código, sin complicaciones técnicas.
                </Typography>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                    tuempresa.com.ar ✓<br/>
                    tienda.tuempresa.com ✓<br/>
                    mail.tuempresa.com ✓
                  </Typography>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: '#00b8d9', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(0, 184, 217, 0.3)'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" color="white">2</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Escaneamos Todo
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Nuestros robots analizan SSL, DNS, headers de seguridad, puertos y configuraciones críticas 24/7.
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                  <Chip icon={<Https />} label="SSL/TLS" size="small" color="primary" />
                  <Chip icon={<Email />} label="Email Sec" size="small" color="primary" />
                  <Chip icon={<NetworkCheck />} label="Headers" size="small" color="primary" />
                  <Chip icon={<BugReport />} label="Puertos" size="small" color="primary" />
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: '#2ecc71', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 32px rgba(46, 204, 113, 0.3)'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" color="white">3</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Actúas con Confianza
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Recibes alertas inmediatas + recomendaciones específicas + reportes PDF para implementar.
                </Typography>
                <Alert severity="success" sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight="bold">
                    🚨 SSL vence en 7 días
                  </Typography>
                  <Typography variant="caption">
                    → Renueva con tu proveedor hosting
                  </Typography>
                </Alert>
              </Box>
            </Grid>
          </Grid>

          {/* ROI Guarantee Section */}
          <Box sx={{ mt: 8, textAlign: 'center', bgcolor: 'primary.main', color: 'white', p: 4, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <TrendingUp />
              Garantía de ROI
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Si no mejoramos tu seguridad en 30 días, te devolvemos tu dinero.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Promedio: las empresas ahorran $2,840 USD en su primer mes evitando una sola brecha
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          ¿Por qué Elegir Securyx?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Protección digital empresarial al alcance de pequeñas y medianas empresas
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card elevation={2} sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            PyMEs que Confían en Nosotros
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 6, opacity: 0.8 }}>
            Casos reales de empresas que mejoraron su protección digital con Securyx
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'grey.800', color: 'white', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: '#FFD700' }} />
                    <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                      Excelente
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "Detectamos 12 vulnerabilidades críticas que no sabíamos que teníamos. 
                    En 2 semanas mejoramos nuestro Health Score de 45% a 87%."
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        María González
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        CEO, Consultora Integral SRL
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'grey.800', color: 'white', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: '#FFD700' }} />
                    <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                      Muy recomendado
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "Antes pagábamos $200 USD/mes a un consultor. Ahora con Securyx 
                    tenemos monitoreo 24/7 por solo $29/mes. Increíble valor."
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Carlos Mendez
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        CTO, TechnoSoft Argentina
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'grey.800', color: 'white', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: '#FFD700' }} />
                    <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                      Fácil de usar
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "Sin conocimientos técnicos pude configurar el monitoreo de nuestros 
                    3 dominios. Los reportes PDF son perfectos para mostrar al directorio."
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <Lock />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Ana Rodríguez  
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Gerente IT, Comercial del Norte
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Trust indicators */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
              Confiado por más de 150+ PyMEs en América Latina
            </Typography>
            <Stack direction="row" spacing={4} justifyContent="center" alignItems="center" flexWrap="wrap">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Verified color="primary" />
                <Typography variant="body2">ISO 27001 Certified</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield color="success" />
                <Typography variant="body2">SOC 2 Compliant</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock color="warning" />
                <Typography variant="body2">GDPR Ready</Typography>
              </Box>
            </Stack>
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
          py: 10,
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 71, 87, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 184, 217, 0.1) 0%, transparent 50%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3,
                background: 'linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Protección Digital Empresarial
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Elegí el nivel de protección que tu PyME necesita
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
              <Shield sx={{ color: '#ff4757' }} />
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
                <Shield sx={{ color: '#2ecc71' }} />
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
                      <Analytics />
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
                      <Speed />
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
                <Shield sx={{ color: '#00b8d9' }} />
                <Typography variant="body2">SOC 2 Type II</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock sx={{ color: '#ffa726' }} />
                <Typography variant="body2">GDPR Compliant</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security sx={{ color: '#e91e63' }} />
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
                  <Shield fontSize="small" />
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
