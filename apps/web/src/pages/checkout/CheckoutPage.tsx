import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const CREATE_PAYMENT_PREFERENCE = gql`
  mutation CreatePaymentPreference(
    $plan: String!
    $successUrl: String!
    $failureUrl: String!
    $pendingUrl: String!
  ) {
    createPaymentPreference(
      plan: $plan
      successUrl: $successUrl
      failureUrl: $failureUrl
      pendingUrl: $pendingUrl
    ) {
      preferenceId
      initPoint
    }
  }
`;

const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 29,
    features: [
      '1 dominio monitoreado',
      'Escaneos ilimitados',
      'Alertas por email',
      'Dashboard completo',
    ],
  },
  GROWTH: {
    name: 'Growth',
    price: 69,
    features: [
      '3 dominios monitoreados',
      'Escaneos ilimitados',
      'Alertas por email y Slack',
      'Reportes PDF',
      '3 usuarios en el equipo',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 149,
    features: [
      'Dominios ilimitados',
      'Escaneos ilimitados',
      'Alertas avanzadas',
      'Reportes PDF y CSV',
      'Usuarios ilimitados',
      'API access',
      'Soporte prioritario',
    ],
  },
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan')?.toUpperCase() as keyof typeof PLANS;
  
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>(
    planParam && PLANS[planParam] ? planParam : 'STARTER'
  );

  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT_PREFERENCE);

  // Validar plan en URL
  useEffect(() => {
    if (planParam && !PLANS[planParam]) {
      toast.error('Plan no válido');
      navigate('/checkout?plan=STARTER');
    }
  }, [planParam, navigate]);

  const plan = PLANS[selectedPlan];
  const usdToArs = 1480; // TODO: Obtener del backend
  const priceARS = plan.price * usdToArs;

  const handlePayment = async () => {
    try {
      toast.loading('Generando link de pago...', { id: 'checkout' });

      const baseUrl = window.location.origin;
      
      const { data } = await createPayment({
        variables: { 
          plan: selectedPlan,
          successUrl: `${baseUrl}/checkout/success`,
          failureUrl: `${baseUrl}/checkout/error`,
          pendingUrl: `${baseUrl}/checkout/pending`,
        },
      });

      toast.success('Redirigiendo a MercadoPago...', { id: 'checkout' });

      // Redirigir a MercadoPago
      window.location.href = data.createPaymentPreference.initPoint;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Error al procesar el pago', { id: 'checkout' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/app/scans')}
        sx={{ mb: 4, color: '#666' }}
      >
        Volver al dashboard
      </Button>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Elegiste el Plan {plan.name}
        </Typography>
        <Typography variant="h5" sx={{ color: '#666' }}>
          Comenzá a proteger tu negocio hoy
        </Typography>
      </Box>

      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: '16px',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header del plan */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976D2' }}>
              {plan.name}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                ${plan.price}
                <Typography component="span" variant="h6" sx={{ color: '#666', fontWeight: 400 }}>
                  {' '}USD/mes
                </Typography>
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                ≈ ${priceARS.toLocaleString('es-AR')} ARS/mes
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Features */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            ✨ Qué incluye:
          </Typography>
          <List sx={{ mb: 3 }}>
            {plan.features.map((feature, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckIcon sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Info de pago */}
          <Alert severity="info" sx={{ mb: 3 }}>
            💳 Pago seguro procesado por <strong>MercadoPago</strong>
            <br />
            Aceptamos todas las tarjetas de crédito y débito
          </Alert>

          {/* Botón de pago */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
            onClick={handlePayment}
            disabled={loading}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              bgcolor: '#00A859',
              '&:hover': { bgcolor: '#008F4C' },
            }}
          >
            {loading ? 'Generando pago...' : 'Pagar con MercadoPago'}
          </Button>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#999' }}>
            Al continuar aceptás los términos y condiciones de Securyx
          </Typography>
        </CardContent>
      </Card>

      {/* Cambiar de plan */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
          ¿Querés ver otros planes?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.keys(PLANS).map((planKey) => (
            <Button
              key={planKey}
              variant={selectedPlan === planKey ? 'contained' : 'outlined'}
              onClick={() => setSelectedPlan(planKey as keyof typeof PLANS)}
              sx={{ minWidth: 100 }}
            >
              {PLANS[planKey as keyof typeof PLANS].name}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
