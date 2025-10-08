import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: '¿Qué tan difícil es implementar la solución?',
    answer: 'Súper fácil. Solo necesitas registrarte, agregar tus dominios y listo. El primer escaneo se ejecuta automáticamente en menos de 5 minutos. No requiere instalación de software ni conocimientos técnicos.'
  },
  {
    question: '¿Qué pasa si no sé interpretar los resultados?',
    answer: 'Cada vulnerabilidad viene con explicaciones en lenguaje simple y recomendaciones específicas paso a paso. Además, ofrecemos soporte por email en español para ayudarte a implementar las mejoras.'
  },
  {
    question: '¿Es seguro que escaneen mi sitio web?',
    answer: 'Absolutamente. Solo realizamos escaneos externos (como lo haría cualquier visitante web). No accedemos a tu servidor ni datos internos. Cumplimos con estándares internacionales de seguridad y privacidad.'
  },
  {
    question: '¿Cuánto tiempo toma ver resultados?',
    answer: 'El primer escaneo completo toma entre 3-10 minutos dependiendo del tamaño de tu sitio. Los escaneos posteriores son más rápidos (1-3 min). Recibes notificaciones inmediatas si detectamos algo crítico.'
  },
  {
    question: '¿Puedo cancelar cuando quiera?',
    answer: 'Sí, sin compromisos ni penalizaciones. Puedes cancelar tu suscripción en cualquier momento desde tu panel de control. El servicio continúa hasta el final del período facturado.'
  },
  {
    question: '¿Ofrecen soporte técnico en español?',
    answer: '¡Por supuesto! Todo nuestro soporte es en español. Respondemos consultas por email en menos de 24 horas. Los clientes Pro tienen soporte prioritario con respuesta en 4 horas.'
  }
];

export function FAQSection() {
  // Split FAQ items into two columns
  const firstColumnItems = faqItems.slice(0, Math.ceil(faqItems.length / 2));
  const secondColumnItems = faqItems.slice(Math.ceil(faqItems.length / 2));

  return (
    <Box 
      id="faq" 
      sx={{ 
        py: 10, 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
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
            Dudas Frecuentes
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
            Preguntas Frecuentes
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
            Resolvemos las dudas más comunes sobre protección digital para PyMEs
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {firstColumnItems.map((item, index) => (
              <Accordion 
                key={index}
                elevation={2}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: '#3b82f6' }} />}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.05)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    sx={{ 
                      color: '#1e293b',
                      fontSize: '1.1rem'
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Typography 
                    sx={{ 
                      color: '#64748b',
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            {secondColumnItems.map((item, index) => (
              <Accordion 
                key={index}
                elevation={2}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: '#3b82f6' }} />}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.05)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    sx={{ 
                      color: '#1e293b',
                      fontSize: '1.1rem'
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Typography 
                    sx={{ 
                      color: '#64748b',
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1e293b',
              fontWeight: 600,
              mb: 2
            }}
          >
            ¿Tienes otra pregunta?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              mb: 4,
              fontSize: '1.1rem'
            }}
          >
            Nuestro equipo está aquí para ayudarte en español
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(10px)',
              px: 4,
              py: 2,
              borderRadius: 2,
              border: '2px solid rgba(59, 130, 246, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6'
              }
            }}
          >
            <Typography 
              variant="body1" 
              fontWeight={600} 
              sx={{ color: '#3b82f6' }}
            >
              Contactar Soporte
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
