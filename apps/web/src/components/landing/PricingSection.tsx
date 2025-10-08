import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Stack
} from '@mui/material';
import { 
  Shield, 
  AttachMoney, 
  CheckCircle, 
  Star, 
  LocalFireDepartment,
  Cancel,
  Phone,
  Business,
  Verified
} from '@mui/icons-material';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  priceNote?: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
  popular?: boolean;
  contact?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfecto para PyMEs que arrancan',
    price: '$29',
    period: '/mes',
    priceNote: 'Menos que un café por día',
    features: [
      '1 dominio monitoreado 24/7',
      'Escaneos semanales automáticos',
      'Reportes PDF profesionales',
      'Alertas críticas por email',
      'Soporte en español'
    ],
    buttonText: 'Empezar Ahora',
    buttonColor: '#ff4757',
    popular: true
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Para empresas en crecimiento',
    price: '$99',
    period: '/mes',
    features: [
      '5 dominios monitoreados',
      'Escaneos diarios',
      'Integraciones Slack/Teams',
      'Reportes PDF + CSV',
      'Usuarios ilimitados'
    ],
    buttonText: 'Elegir Growth',
    buttonColor: '#ff6b35'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Máxima protección y control',
    price: 'Consultá',
    period: '',
    priceNote: 'Precio personalizado',
    features: [
      'Dominios ilimitados',
      'Escaneos en tiempo real',
      'API personalizada',
      'Reportes compliance',
      'Soporte dedicado'
    ],
    buttonText: 'Contactanos',
    buttonColor: '#00b4d8',
    contact: true
  }
];

export function PricingSection() {
  return (
    <Box 
      id="precios"
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
          {pricingPlans.map((plan) => (
            <Grid item xs={12} lg={4} key={plan.id}>
              <Card 
                elevation={plan.popular ? 8 : 4}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  bgcolor: plan.popular ? 'white' : 'rgba(255,255,255,0.95)',
                  border: plan.popular ? '3px solid #ff4757' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  overflow: 'visible',
                  transform: plan.popular ? { lg: 'scale(1.05)' } : 'none',
                  '&:hover': { 
                    transform: plan.popular ? { lg: 'scale(1.08)' } : 'translateY(-8px)',
                    boxShadow: plan.popular ? '0 20px 60px rgba(255, 71, 87, 0.4)' : '0 16px 40px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
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
                )}

                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={plan.popular ? 800 : 700} sx={{ color: '#333', mb: 1 }}>
                    {plan.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {plan.description}
                  </Typography>
                  
                  {/* Price */}
                  <Box sx={{ mb: 4 }}>
                    {plan.contact ? (
                      <Typography variant="h3" fontWeight={900} sx={{ color: plan.buttonColor, mb: 1 }}>
                        {plan.price}
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
                        <Typography variant="h2" fontWeight={900} sx={{ color: plan.buttonColor }}>
                          {plan.price}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                          {plan.period}
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {plan.contact ? plan.priceNote : 'USD • Facturación mensual'}
                    </Typography>
                    {plan.priceNote && !plan.contact && (
                      <Typography variant="body2" sx={{ color: plan.buttonColor, fontWeight: 600, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <LocalFireDepartment fontSize="small" />
                        {plan.priceNote}
                      </Typography>
                    )}
                  </Box>

                  {/* Features */}
                  <Box sx={{ textAlign: 'left', mb: 4 }}>
                    <Stack spacing={2}>
                      {plan.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CheckCircle sx={{ color: plan.buttonColor, fontSize: 20 }} />
                          <Typography variant="body1" fontWeight={500}>
                            <strong>{feature.split(' ')[0]} {feature.split(' ')[1]}</strong> {feature.split(' ').slice(2).join(' ')}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    startIcon={plan.contact ? <Phone /> : undefined}
                    sx={{
                      bgcolor: plan.popular ? plan.buttonColor : `rgba(${plan.buttonColor === '#ff4757' ? '255,71,87' : plan.buttonColor === '#ff6b35' ? '255,107,53' : '0,180,216'}, 0.1)`,
                      borderColor: plan.popular ? plan.buttonColor : 'rgba(255,255,255,0.3)',
                      color: plan.popular ? 'white' : 'white',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: plan.popular ? 700 : 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': { 
                        bgcolor: plan.popular ? (plan.buttonColor === '#ff4757' ? '#ff3742' : plan.buttonColor) : `rgba(${plan.buttonColor === '#ff4757' ? '255,71,87' : plan.buttonColor === '#ff6b35' ? '255,107,53' : '0,180,216'}, 0.2)`,
                        borderColor: plan.buttonColor,
                        transform: 'translateY(-2px)',
                        boxShadow: plan.popular ? `0 8px 25px rgba(${plan.buttonColor === '#ff4757' ? '255,71,87' : plan.buttonColor === '#ff6b35' ? '255,107,53' : '0,180,216'}, 0.4)` : undefined
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  {plan.popular && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <CheckCircle fontSize="small" color="success" /> 14 días gratis • <Cancel fontSize="small" color="error" /> Sin compromiso
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
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
  );
}
