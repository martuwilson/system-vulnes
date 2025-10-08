import { Box, Container, Typography, Grid, Avatar, Rating } from '@mui/material';
import { 
  Verified, 
  BarChart, 
  Savings, 
  Schedule, 
  Star 
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
    quote: 'Detectamos 12 vulnerabilidades críticas que no sabíamos que teníamos. En 2 semanas mejoramos nuestro Health Score de 45% a 87%. El ROI fue inmediato.',
    resultType: 'health',
    resultText: 'Mejora del Health Score: +42 puntos',
    resultIcon: <BarChart sx={{ color: '#10b981', fontSize: 18 }} />,
    clientSince: 'Cliente desde hace 8 meses'
  },
  {
    name: 'Carlos Mendez',
    role: 'CTO',
    company: 'TechnoSoft Argentina',
    avatar: 'CM',
    rating: 5,
    date: 'hace 1 mes',
    quote: 'Antes pagábamos $200 USD/mes a un consultor. Ahora con Securyx tenemos monitoreo 24/7 por solo $29/mes. El ahorro es increíble y la cobertura mucho mejor.',
    resultType: 'savings',
    resultText: 'Ahorro mensual: $171 USD (-85%)',
    resultIcon: <Savings sx={{ color: '#10b981', fontSize: 18 }} />,
    clientSince: 'Cliente desde hace 6 meses'
  },
  {
    name: 'Ana Rodríguez',
    role: 'Gerente IT',
    company: 'Comercial del Norte',
    avatar: 'AR',
    rating: 5,
    date: 'hace 3 semanas',
    quote: 'Sin conocimientos técnicos pude configurar el monitoreo de nuestros 3 dominios. Los reportes PDF son perfectos para mostrar al directorio los avances.',
    resultType: 'time',
    resultText: 'Setup time: 15 minutos vs 2 días',
    resultIcon: <Schedule sx={{ color: '#10b981', fontSize: 18 }} />,
    clientSince: 'Cliente desde hace 4 meses'
  }
];

const avatarColors = {
  MG: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
  CM: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  AR: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
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
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {testimonial.resultIcon}
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
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
              <Star sx={{ color: '#fbbf24', fontSize: 32 }} />
            </Box>
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
        </Box>
      </Container>
    </Box>
  );
}
