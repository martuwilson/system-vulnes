import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, WhatsApp } from '@mui/icons-material';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: '¿Necesito saber de seguridad para usar Securyx?',
    answer: 'Para nada. Securyx está diseñado para dueños de negocio como vos. Todo funciona automáticamente: solo agregás tu sitio web y nosotros nos encargamos del resto. Los reportes están en lenguaje simple, sin tecnicismos.'
  },
  {
    question: '¿Qué tan rápido empiezo a ver resultados?',
    answer: 'En pocos minutos ya tenés tu primer reporte completo. Y cada vez que encontremos algo importante, te avisamos al instante por email. Es súper rápido y automático.'
  },
  {
    question: '¿Puedo confiar en que sea seguro para mi sitio?',
    answer: 'Absolutamente. Solo miramos tu sitio como lo haría cualquier visitante normal. No tocamos nada interno de tu negocio. Es como cuando alguien entra a tu local: puede ver la vidriera, pero no tu caja registradora.'
  },
  {
    question: '¿Y si no entiendo algo en los reportes?',
    answer: 'Cada problema viene explicado en español simple, con pasos claros para solucionarlo. Si aún tenés dudas, nuestro equipo te ayuda por WhatsApp o email. Nadie se queda con preguntas sin responder.'
  },
  {
    question: '¿Puedo cancelar si no me convence?',
    answer: 'Por supuesto. Sin compromisos, sin letras chicas. Cancelás cuando quieras desde tu panel y listo. Tu servicio sigue funcionando hasta que termine el mes que ya pagaste.'
  },
  {
    question: '¿Realmente me van a atender en español?',
    answer: 'Sí, siempre. Todo nuestro equipo es argentino. Te respondemos por email, WhatsApp o chat en español. Los clientes Pro tienen respuesta ultra rápida, pero todos reciben atención humana y personalizada.'
  },
  {
    question: '¿Mis datos están protegidos con Securyx?',
    answer: 'Tu información está más protegida que en un banco. Solo vemos lo necesario para ayudarte y nunca compartimos nada con terceros. Cumplimos con todas las normativas de privacidad internacionales.'
  },
  {
    question: '¿Qué pasa si tengo más de un sitio web?',
    answer: 'Perfecto, podés agregar todos los sitios que manejes desde un solo panel. Cada uno se monitorea por separado y recibís reportes individuales. Ideal para franquicias o consultoras que manejan varios clientes.'
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
          background: 'radial-gradient(circle at 20% 30%, rgba(174, 234, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 184, 217, 0.03) 0%, transparent 50%)',
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
            ¿Dudas? Te Ayudamos
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
            Lo Que Más Nos Preguntan
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
            Estas son las dudas que tenían otros dueños antes de empezar (y la tranquilidad que tienen ahora)
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
                  border: '1px solid rgba(174, 234, 0, 0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(174, 234, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(174, 234, 0, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: '#1E2A38' }} />}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(174, 234, 0, 0.05)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    sx={{ 
                      color: '#1E2A38',
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
                  border: '1px solid rgba(174, 234, 0, 0.2)',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(174, 234, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(174, 234, 0, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: '#1E2A38' }} />}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(174, 234, 0, 0.05)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    sx={{ 
                      color: '#1E2A38',
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
              color: '#1E2A38',
              fontWeight: 600,
              mb: 2
            }}
          >
            ¿Seguís con alguna duda?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              mb: 3,
              fontSize: '1.1rem',
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            Hablemos por WhatsApp. Nuestro equipo argentino te responde al toque y te ayuda con lo que necesites
          </Typography>
          
          {/* Stats Row */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#AEEA00', fontWeight: 700 }}>
                {'< 2hs'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Tiempo de respuesta promedio
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#00B8D9', fontWeight: 700 }}>
                100%
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                En español, siempre
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1E2A38', fontWeight: 700 }}>
                Real
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Personas, no bots
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
              px: 6,
              py: 3,
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)'
              }
            }}
          >
            <WhatsApp sx={{ color: 'white', fontSize: 24 }} />
            <Typography 
              variant="body1" 
              fontWeight={700} 
              sx={{ color: 'white' }}
            >
              Escribinos por WhatsApp
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              mt: 2,
              fontSize: '0.9rem'
            }}
          >
            También por email: hola@securyx.com.ar
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
