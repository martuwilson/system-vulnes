import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import { HourglassEmpty as PendingIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

export function CheckoutPending() {
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
          <PendingIcon sx={{ fontSize: 80, color: '#FF9800', mb: 3 }} />
          
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Pago pendiente
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
          </Typography>

          <Button
            variant="contained"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/app/scans')}
            sx={{ py: 2, px: 4, fontWeight: 700 }}
          >
            Ir al Dashboard
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
