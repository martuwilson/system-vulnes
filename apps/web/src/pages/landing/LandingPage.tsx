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

      {/* Pricing Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Planes y Precios
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Elige el plan que mejor se adapte a tu negocio
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Trial Plan */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  border: '2px solid',
                  borderColor: 'success.main',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  GRATIS
                </Box>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                    Trial
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      $0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      por 14 días
                    </Typography>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="1 dominio" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Escaneo semanal" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Reportes PDF" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="1 usuario" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                  </List>

                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Empezar Gratis
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Starter Plan */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  POPULAR
                </Box>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                    Starter
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      $29
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      USD por mes
                    </Typography>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="1 dominio" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Escaneo semanal" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Reportes PDF" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="1 usuario" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Ideal para PyMEs" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                  </List>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Comenzar
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Growth Plan */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Growth
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      $99
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      USD por mes
                    </Typography>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="5 dominios" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Escaneo diario" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Integraciones Slack/Teams" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Reportes PDF + CSV" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Usuarios ilimitados" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Tendencias históricas" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                    </ListItem>
                  </List>

                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Elegir Growth
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Pro Plan */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  bgcolor: 'grey.900',
                  color: 'white',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Pro
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFD700' }}>
                      $249
                    </Typography>
                    <Typography variant="body2" color="grey.400">
                      USD por mes
                    </Typography>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ color: '#FFD700' }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Dominios ilimitados" 
                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ color: '#FFD700' }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Escaneo cada 6 horas" 
                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ color: '#FFD700' }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Todas las integraciones" 
                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ color: '#FFD700' }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Reportes de compliance" 
                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ color: '#FFD700' }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Acceso auditor" 
                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ color: '#FFD700' }} fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Soporte prioritario" 
                        primaryTypographyProps={{ fontSize: '0.9rem', color: 'white' }} 
                      />
                    </ListItem>
                  </List>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3,
                      bgcolor: '#FFD700',
                      color: 'black',
                      '&:hover': { bgcolor: '#FFC107' }
                    }}
                    onClick={() => navigate('/auth/register')}
                  >
                    Elegir Pro
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Info */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              🔒 Todos los planes incluyen seguridad de nivel empresarial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              💳 Pagos seguros procesados por Stripe • 🔄 Cancela cuando quieras • 💬 Soporte en español
            </Typography>
          </Box>
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
