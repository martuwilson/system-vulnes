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
  Paper
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
  BugReport
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Escaneo Completo de Seguridad',
      description: 'Análisis automatizado de SSL, DNS, headers de seguridad y puertos abiertos'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Resultados en Tiempo Real',
      description: 'Procesamiento asíncrono con colas Redis para escaneos rápidos y eficientes'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Dashboard Intuitivo',
      description: 'Métricas claras, health score y gestión centralizada de vulnerabilidades'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Monitoreo Continuo',
      description: 'Supervisión 24/7 de tus dominios con alertas automáticas'
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Protege tu Negocio Digital
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Escaneo automático de seguridad para PyMEs. 
            Identifica vulnerabilidades antes de que los hackers lo hagan.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/auth/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Comenzar Gratis
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/auth/login')}
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>

          <Box sx={{ mt: 6 }}>
            <Chip 
              label="✨ MVP Listo - Test Gratuito" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          ¿Por qué SecurePYME?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Seguridad empresarial al alcance de pequeñas y medianas empresas
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
              >
                Verifica tu Sitio Ahora
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Comenzar Evaluación Gratuita
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                SecurePYME
              </Typography>
              <Typography variant="body2" color="grey.400">
                Seguridad digital accesible para pequeñas y medianas empresas.
                Protege tu negocio con tecnología empresarial.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Producto
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">Features</Typography>
                <Typography variant="body2" color="grey.400">Precios</Typography>
                <Typography variant="body2" color="grey.400">Documentación</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Soporte
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">Contacto</Typography>
                <Typography variant="body2" color="grey.400">FAQ</Typography>
                <Typography variant="body2" color="grey.400">Status</Typography>
              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ borderTop: '1px solid #333', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="grey.500">
              © 2025 SecurePYME. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
