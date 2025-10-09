
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Chip,
  Divider
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

interface WelcomeCardProps {
  userCompany?: {
    name: string;
    domain: string;
  };
}

export function WelcomeCard({ userCompany }: WelcomeCardProps) {
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 32, color: '#00B8D9' }} />,
      title: 'Protección 24/7',
      description: 'Monitoreamos tu sitio web las 24 horas para detectar amenazas'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: '#AEEA00' }} />,
      title: 'Análisis Rápido',
      description: 'Escaneos completos en minutos, no en días'
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 32, color: '#F57C00' }} />,
      title: 'Alertas Inteligentes',
      description: 'Te avisamos inmediatamente si detectamos problemas'
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 32, color: '#1E2A38' }} />,
      title: 'Reportes Claros',
      description: 'Informes fáciles de entender, sin jerga técnica'
    }
  ];

  return (
    <Card 
      sx={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E3F2FD 100%)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(30, 42, 56, 0.1)',
        border: '2px solid #00B8D9',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Decoración visual */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: 20,
          background: 'linear-gradient(135deg, #AEEA00 0%, #C6FF00 100%)',
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(174, 234, 0, 0.3)'
        }}
      >
        <SecurityIcon sx={{ fontSize: 40, color: '#1E2A38' }} />
      </Box>

      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              color: '#1E2A38',
              background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            🎉 ¡Bienvenido a Securyx Pyme!
          </Typography>
          
          <Typography variant="h6" color="#2D3748" sx={{ mb: 2 }}>
            {userCompany?.name ? 
              `Estamos listos para proteger ${userCompany.name}` : 
              'Protegemos tu negocio digital'
            }
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Tu plataforma de ciberseguridad diseñada especialmente para pequeñas y medianas empresas. 
            Sin complicaciones técnicas, solo protección efectiva.
          </Typography>

          {userCompany && (
            <Chip 
              label={`🌐 Empresa: ${userCompany.name}`}
              sx={{
                backgroundColor: '#E8F5E8',
                color: '#1E2A38',
                fontWeight: 600,
                border: '2px solid #AEEA00',
                fontSize: '0.875rem',
                px: 2,
                py: 1
              }}
            />
          )}
        </Box>

        <Divider sx={{ my: 3, borderColor: '#00B8D9', opacity: 0.3 }} />

        {/* Features Grid */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" color="#1E2A38" gutterBottom>
            ¿Qué hace Securyx por tu negocio?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box 
                  display="flex" 
                  alignItems="flex-start" 
                  gap={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(30,42,56,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <Box>{feature.icon}</Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" color="#1E2A38">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box 
          textAlign="center" 
          sx={{
            background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
            borderRadius: 3,
            p: 3,
            color: 'white'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🚀 ¡Empecemos a proteger tu negocio!
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Agrega tu primer sitio web y en minutos tendrás un análisis completo de seguridad
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(135deg, #AEEA00 0%, #C6FF00 100%)',
              color: '#1E2A38',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #C6FF00 0%, #AEEA00 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(174, 234, 0, 0.4)'
              }
            }}
          >
            Agregar Mi Primer Sitio Web
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}