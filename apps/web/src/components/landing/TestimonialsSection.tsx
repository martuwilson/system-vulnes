import { Box, Container, Typography, Grid, Avatar, Rating } from '@mui/material';
import { 
  Verified, 
  BarChart, 
  Savings, 
  Schedule, 
  Star,
  SentimentSatisfied,
  Support
} from '@mui/icons-material';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  date: string;
  quote: string;
  resultType: 'health' | 'savings' | 'time';
  resultText: string;
  resultIcon: React.ReactNode;
  clientSince: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'María González',
    role: 'CEO',
    company: 'Consultora Integral SRL',
    avatar: 'MG',
    rating: 5,
    date: 'hace 2 semanas',
    quote: 'Por primera vez tengo la tranquilidad de saber exactamente qué tan seguro está mi negocio. Detectamos 12 vulnerabilidades críticas que ni sabíamos que existían. En solo 2 semanas pasamos de 45% a 87% de seguridad.',
    resultType: 'health',
    resultText: 'Health Score: de 45% a 87% ↗️',
    resultIcon: <BarChart sx={{ color: '#AEEA00', fontSize: 18 }} />,
    clientSince: 'Cliente desde hace 8 meses'
  },
  {
    name: 'Carlos Méndez',
    role: 'CTO',
    company: 'TechnoSoft Argentina',
    avatar: 'CM',
    rating: 5,
    date: 'hace 1 mes',
    quote: 'Antes pagábamos $200 USD/mes a un consultor que venía una vez al mes. Ahora con Securyx tenemos monitoreo 24/7 por $29/mes. El ahorro es increíble y dormimos mucho más tranquilos.',
    resultType: 'savings',
    resultText: 'Ahorro: $171 USD/mes (-85%) 💰',
    resultIcon: <Savings sx={{ color: '#AEEA00', fontSize: 18 }} />,
    clientSince: 'Cliente desde hace 6 meses'
  },
  {
    name: 'Ana Rodríguez',
    role: 'Gerente IT',
    company: 'Comercial del Norte',
    avatar: 'AR',
    rating: 5,
    date: 'hace 3 semanas',
    quote: 'Soy gerente, no técnica, y pude configurar todo en 15 minutos. Los reportes PDF son perfectos para mostrar al directorio que nuestra seguridad está bajo control. Mi jefe está más que contento.',
    resultType: 'time',
    resultText: 'Setup: 15min vs 2 días ⚡',
    resultIcon: <Schedule sx={{ color: '#AEEA00', fontSize: 18 }} />,
    clientSince: 'Cliente desde hace 4 meses'
  }
];

const avatarColors = {
  MG: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
  CM: 'linear-gradient(135deg, #AEEA00 0%, #00B8D9 100%)',
  AR: 'linear-gradient(135deg, #00B8D9 0%, #AEEA00 100%)'
};

export function TestimonialsSection() {
  return (
    <Box 
      id="testimonials"
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
              color: '#AEEA00',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2
            }}
          >
            Historias Reales
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #ffffff 0%, #AEEA00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Dueños que Ya Duermen Tranquilos
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
            PyMEs argentinas que dejaron atrás el miedo y recuperaron la tranquilidad con Securyx
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
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
                    borderColor: 'rgba(174, 234, 0, 0.3)',
                    boxShadow: '0 20px 40px rgba(174, 234, 0, 0.1)'
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
                    bgcolor: 'rgba(174, 234, 0, 0.2)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    border: '1px solid rgba(174, 234, 0, 0.3)'
                  }}
                >
                  <Verified sx={{ fontSize: 16, color: '#AEEA00' }} />
                  <Typography variant="caption" sx={{ color: '#AEEA00', fontWeight: 600 }}>
                    VERIFICADO
                  </Typography>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
                  <Rating 
                    value={testimonial.rating} 
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
                    {testimonial.rating}.0 • {testimonial.date}
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
                  {testimonial.quote}
                </Typography>

                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: avatarColors[testimonial.avatar as keyof typeof avatarColors], 
                      mr: 3,
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {testimonial.role}, {testimonial.company}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {testimonial.clientSince}
                    </Typography>
                  </Box>
                </Box>

                {/* Results Badge */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'rgba(174, 234, 0, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(174, 234, 0, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {testimonial.resultIcon}
                    <Typography variant="body2" sx={{ color: '#AEEA00', fontWeight: 600 }}>
                      {testimonial.resultText}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Overall Stats */}
        <Box sx={{ mt: 10 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                4.9/5
              </Typography>
              <Star sx={{ color: '#AEEA00', fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}>
              247 dueños de PyMEs nos recomiendan con sus amigos
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <SentimentSatisfied sx={{ color: '#AEEA00', fontSize: 28 }} />
                  <Typography variant="h3" sx={{ color: '#AEEA00', fontWeight: 700 }}>
                    96%
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  No se van nunca más
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Una vez que prueban, se quedan
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <Schedule sx={{ color: '#00B8D9', fontSize: 28 }} />
                  <Typography variant="h3" sx={{ color: '#00B8D9', fontWeight: 700 }}>
                    15min
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Y ya estás protegido
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Más rápido que pedir un delivery
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <Support sx={{ color: '#1E2A38', fontSize: 28 }} />
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    24/7
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Te ayudamos siempre
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  En español y cuando lo necesités
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
