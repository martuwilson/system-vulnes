import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Security, Speed, Analytics, Shield } from '@mui/icons-material';

export function FeaturesSection() {
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
      icon: <Analytics sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Reportes Inteligentes',
      description: 'Dashboard ejecutivo con métricas claras y recomendaciones accionables para decisiones informadas'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Monitoreo Continuo',
      description: 'Vigilancia 24/7 de tu infraestructura digital con alertas automáticas ante vulnerabilidades'
    }
  ];

  return (
    <Box 
      id="por-que-elegirnos"
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
            Por Qué Elegirnos
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
            Características Principales
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
            Tecnología avanzada diseñada específicamente para PyMEs argentinas
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(59, 130, 246, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b', 
                      mb: 2,
                      lineHeight: 1.3
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#64748b', 
                      lineHeight: 1.7,
                      fontSize: '1.1rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
