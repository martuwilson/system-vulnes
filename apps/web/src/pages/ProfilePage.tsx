import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { 
  Person, 
  Edit, 
  Save, 
  CreditCard,
  TrendingUp,
  CheckCircle,
  Receipt,
  Upgrade,
} from '@mui/icons-material';
import { gql, useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      companyName
      subscription {
        plan
        status
        currentPeriodStart
        currentPeriodEnd
        canceledAt
        mercadopagoPaymentId
      }
      companies {
        id
        name
      }
    }
    # Podríamos agregar una query para los assets/scans si queremos mostrar uso
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($firstName: String!, $lastName: String!, $companyName: String) {
    updateProfile(firstName: $firstName, lastName: $lastName, companyName: $companyName) {
      id
      firstName
      lastName
      companyName
    }
  }
`;

export function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { data, loading, refetch } = useQuery(ME_QUERY);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
  });

  const user = data?.me;

  // Plan limits
  const planLimits: Record<string, { domains: number, scans: string, features: string[] }> = {
    TRIAL: {
      domains: 1,
      scans: '5 escaneos totales',
      features: ['Escaneos básicos', 'Alertas por email', '7 días de prueba']
    },
    STARTER: {
      domains: 1,
      scans: 'Ilimitados',
      features: ['1 dominio', 'Escaneos ilimitados', 'Alertas por email', 'Dashboard completo']
    },
    GROWTH: {
      domains: 3,
      scans: 'Ilimitados',
      features: ['3 dominios', 'Escaneos ilimitados', 'Alertas email y Slack', 'Reportes PDF', '3 usuarios']
    },
    PRO: {
      domains: 999,
      scans: 'Ilimitados',
      features: ['Dominios ilimitados', 'Escaneos ilimitados', 'Alertas avanzadas', 'Reportes PDF/CSV', 'Usuarios ilimitados', 'API access', 'Soporte prioritario']
    }
  };

  const planPrices: Record<string, number> = {
    TRIAL: 0,
    STARTER: 29,
    GROWTH: 69,
    PRO: 149,
  };

  const handleEdit = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      companyName: user?.companyName || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        variables: formData,
      });
      await refetch();
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el perfil');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      TRIAL: 'Prueba Gratuita',
      STARTER: 'Starter',
      GROWTH: 'Growth',
      PRO: 'Pro',
    };
    return labels[plan] || plan;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Activo',
      TRIAL: 'Prueba',
      CANCELED: 'Cancelado',
      PAST_DUE: 'Vencido',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      ACTIVE: 'success',
      TRIAL: 'warning',
      CANCELED: 'error',
      PAST_DUE: 'error',
    };
    return colors[status] || 'default';
  };

  const currentPlan = user?.subscription?.plan || 'TRIAL';
  const daysRemaining = user?.subscription?.currentPeriodEnd
    ? Math.ceil((new Date(user.subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const companiesCount = user?.companies?.length || 0;
  const companiesLimit = planLimits[currentPlan]?.domains || 1;
  const usagePercentage = (companiesCount / companiesLimit) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 6 }}>
        Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Avatar y datos básicos */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: '#1976D2',
                  fontSize: '3rem',
                }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user?.email}
              </Typography>
              <Chip 
                label={getStatusLabel(user?.subscription?.status || 'TRIAL')} 
                color={getStatusColor(user?.subscription?.status || 'TRIAL')}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>

          {/* Plan actual */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getPlanLabel(currentPlan)}
                </Typography>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976D2', mb: 1 }}>
                ${planPrices[currentPlan]}
                <Typography component="span" variant="body2" color="text.secondary">
                  {currentPlan === 'TRIAL' ? '' : '/mes'}
                </Typography>
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Uso de dominios
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(usagePercentage, 100)} 
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {companiesCount}/{companiesLimit}
                  </Typography>
                </Box>
              </Box>

              <List dense sx={{ mb: 2 }}>
                {planLimits[currentPlan]?.features.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#10b981', mr: 1 }} />
                    <ListItemText 
                      primary={feature} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>

              {daysRemaining > 0 && (
                <Alert severity={daysRemaining < 7 ? 'warning' : 'info'} sx={{ mb: 2 }}>
                  {daysRemaining} días restantes
                </Alert>
              )}

              {currentPlan !== 'PRO' && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Upgrade />}
                  onClick={() => navigate('/checkout?plan=PRO')}
                  sx={{ mt: 1 }}
                >
                  Mejorar Plan
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={8}>
          {/* Información Personal */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Información Personal
                </Typography>
                {!isEditing && (
                  <Button
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    variant="outlined"
                  >
                    Editar
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={isEditing ? formData.firstName : user?.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    value={isEditing ? formData.lastName : user?.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    value={isEditing ? formData.companyName : user?.companyName || ''}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    helperText="El email no puede ser modificado"
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={updating}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={updating}
                  >
                    Cancelar
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Información de Facturación */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CreditCard color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Facturación
                </Typography>
              </Box>

              {user?.subscription?.mercadopagoPaymentId ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Método de pago
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <CreditCard sx={{ color: '#10b981' }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        MercadoPago
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.subscription.mercadopagoPaymentId}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">
                  No hay método de pago configurado. Activá un plan para agregar tu información de pago.
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Próxima facturación
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {user?.subscription?.currentPeriodEnd 
                  ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString('es-AR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : 'No disponible'}
              </Typography>

              {currentPlan !== 'TRIAL' && (
                <Typography variant="body2" color="text.secondary">
                  Se te cobrará ${planPrices[currentPlan]} USD (≈ ${Math.round(planPrices[currentPlan] * 1480).toLocaleString()} ARS)
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Historial de Pagos */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Receipt color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Historial de Pagos
                </Typography>
              </Box>

              {user?.subscription?.mercadopagoPaymentId ? (
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={`Plan ${getPlanLabel(currentPlan)}`}
                      secondary={new Date(user.subscription.currentPeriodStart).toLocaleDateString('es-AR')}
                    />
                    <Chip label="Pagado" color="success" size="small" />
                    <Typography sx={{ ml: 2, fontWeight: 600 }}>
                      ${planPrices[currentPlan]} USD
                    </Typography>
                  </ListItem>
                </List>
              ) : (
                <Alert severity="info">
                  No hay pagos registrados aún.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
