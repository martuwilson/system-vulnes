import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import { 
  CheckCircle as CheckIcon, 
  Upgrade as UpgradeIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Plan {
  plan: string;
  price: number;
  features: string[];
}

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  error?: {
    message: string;
    code: string;
    currentPlan?: string;
    currentUsage?: number;
    limit?: number;
    upgradeUrl?: string;
    availablePlans?: Plan[];
  };
}

export function UpgradeModal({ open, onClose, error }: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!error) return null;

  const { 
    message, 
    code, 
    currentPlan = 'TRIAL',
    currentUsage = 0,
    limit = 5,
    upgradeUrl = '/checkout?plan=STARTER',
    availablePlans = []
  } = error;

  const handleUpgrade = (planUrl?: string) => {
    const targetUrl = planUrl || upgradeUrl;
    navigate(targetUrl);
    onClose();
  };

  const getTitleByCode = () => {
    switch (code) {
      case 'SCAN_LIMIT_EXCEEDED':
        return '🚀 Alcanzaste el límite de escaneos gratuitos';
      case 'COMPANY_LIMIT_EXCEEDED':
        return '📊 Necesitás más empresas';
      case 'SUBSCRIPTION_INACTIVE':
        return '⚠️ Suscripción inactiva';
      default:
        return '🔒 Actualización requerida';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <UpgradeIcon color="primary" fontSize="large" />
          <Typography variant="h5" component="div" fontWeight="bold">
            {getTitleByCode()}
          </Typography>
        </Box>
        <Button 
          onClick={onClose} 
          color="inherit" 
          size="small"
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          {message}
        </Alert>

        {code === 'SCAN_LIMIT_EXCEEDED' && (
          <Box mb={3}>
            <Typography variant="body1" color="text.secondary" mb={1}>
              Usaste <strong>{currentUsage} de {limit}</strong> escaneos gratuitos.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actualizá tu plan para escaneos ilimitados y más funcionalidades.
            </Typography>
          </Box>
        )}

        {availablePlans.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Planes disponibles
            </Typography>
            
            {availablePlans.map((plan) => (
              <Box 
                key={plan.plan}
                sx={{
                  border: '1px solid',
                  borderColor: plan.plan === 'STARTER' ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 2.5,
                  mb: 2,
                  bgcolor: plan.plan === 'STARTER' ? 'primary.50' : 'background.paper',
                  position: 'relative',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleUpgrade(`/checkout?plan=${plan.plan}`)}
              >
                {plan.plan === 'STARTER' && (
                  <Chip 
                    label="MÁS POPULAR" 
                    color="primary" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      right: 16,
                      fontWeight: 'bold'
                    }}
                  />
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="h6" fontWeight="bold">
                    {plan.plan}
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    USD ${plan.price}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /mes
                    </Typography>
                  </Typography>
                </Box>

                <List dense disablePadding>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={plan.plan === 'STARTER' ? 'contained' : 'outlined'}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade(`/checkout?plan=${plan.plan}`);
                  }}
                >
                  Elegir {plan.plan}
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {availablePlans.length === 0 && (
          <Box textAlign="center" py={2}>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Necesitás actualizar tu plan para continuar.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<UpgradeIcon />}
              onClick={() => handleUpgrade()}
            >
              Ver Planes
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Plan actual: <strong>{currentPlan}</strong>
        </Typography>
        <Box flex={1} />
        <Button onClick={onClose} color="inherit">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
