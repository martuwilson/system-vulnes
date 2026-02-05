import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import { Error as ErrorIcon, Refresh as RetryIcon } from '@mui/icons-material';

export function CheckoutError() {
  const navigate = useNavigate();

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
          <ErrorIcon sx={{ fontSize: 80, color: '#f44336', mb: 3 }} />
          
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Pago rechazado
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
            No pudimos procesar tu pago. Verificá los datos de tu tarjeta e intentá nuevamente.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/app/scans')}
            >
              Volver al Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<RetryIcon />}
              onClick={() => navigate('/checkout?plan=STARTER')}
              sx={{ fontWeight: 700 }}
            >
              Intentar nuevamente
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
