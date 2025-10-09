import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Security, Speed, Analytics, Shield } from '@mui/icons-material';

export function FeaturesSection() {
  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: '#1E2A38' }} />,
      title: 'Revisamos Todo por Vos',
      description: 'Chequeamos si tu sitio web, emails y certificados tienen problemas. Vos solo esperás el reporte, sin tocar nada técnico.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#AEEA00' }} />,
      title: 'Resultados al Instante',
      description: 'No esperás horas ni días. En minutos tenés todo listo y sabés exactamente qué está pasando con la seguridad de tu empresa.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#00B8D9' }} />,
      title: 'Te Decimos Qué Hacer',
      description: 'Cada problema viene con la solución paso a paso. Sin tecnicismos, con ejemplos reales y en español que entendés.'
    },
    {
      icon: <Shield sx={{ fontSize: 40, color: '#1E2A38' }} />,
      title: 'Trabajamos Mientras Dormís',
      description: 'Vigilamos tu negocio 24/7. Si algo sale mal, te avisamos inmediatamente por email o WhatsApp.'
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
          background: 'radial-gradient(circle at 20% 80%, rgba(0, 184, 217, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(174, 234, 0, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#00B8D9',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2
            }}
          >
            Beneficios Reales
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Por Qué Tu Negocio Estará Más Seguro
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
            Simple, poderoso y pensado para empresas como la tuya
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
                    boxShadow: '0 20px 40px rgba(30, 42, 56, 0.15)',
                    borderColor: 'rgba(174, 234, 0, 0.3)'
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
