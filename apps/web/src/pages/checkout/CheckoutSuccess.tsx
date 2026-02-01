import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { CheckCircle as CheckIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

export function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Opcional: tracking de conversión
    console.log('Payment successful');
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <CheckIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 3 }} />
          
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            ¡Pago exitoso!
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
            Tu suscripción se activará automáticamente en los próximos minutos.
            Te enviamos un email de confirmación.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/app/scans')}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
            }}
          >
            Ir al Dashboard
          </Button>

          <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#999' }}>
            Si tenés algún problema, contactanos a soporte@securyx.com
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
