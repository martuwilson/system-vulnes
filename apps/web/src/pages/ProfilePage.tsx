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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Paper,
  CircularProgress,
} from '@mui/material';
import { 
  Edit, 
  Save, 
  CreditCard,
  CheckCircle,
  Receipt,
  Upgrade,
  Close,
  ArrowForward,
  Rocket,
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
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($firstName: String!, $lastName: String!) {
    updateProfile(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const user = data?.me;
  const userCompany = user?.companies?.[0]; // Primera empresa del usuario

  // Debug: Ver qué está llegando
  console.log('🔍 ProfilePage - Data:', data);
  console.log('🔍 ProfilePage - User:', user);
  console.log('🔍 ProfilePage - Loading:', loading);
  console.log('🔍 ProfilePage - Error:', error);
  console.log('🔍 ProfilePage - UserCompany:', userCompany);

  // Plan limits
  const planLimits: Record<string, { domains: number, scans: string, features: string[] }> = {
    TRIAL: {
      domains: 1,
      scans: '5 escaneos totales',
      features: ['Escaneos básicos', 'Alertas por email', 'Dashboard básico']
    },
    STARTER: {
      domains: 1,
      scans: 'Ilimitados',
      features: ['1 dominio protegido', 'Escaneos ilimitados mensuales', 'Alertas por email en tiempo real', 'Dashboard completo']
    },
    GROWTH: {
      domains: 3,
      scans: 'Ilimitados',
      features: ['3 dominios protegidos', 'Escaneos ilimitados', 'Alertas email y Slack', 'Reportes PDF', '3 usuarios del equipo']
    },
    PRO: {
      domains: 999,
      scans: 'Ilimitados',
      features: ['Dominios ilimitados', 'Escaneos ilimitados', 'Alertas avanzadas multicanal', 'Reportes PDF/CSV personalizados', 'Usuarios ilimitados', 'Acceso API completo', 'Soporte prioritario 24/7']
    }
  };

  const planPrices: Record<string, number> = {
    TRIAL: 0,
    STARTER: 29,
    GROWTH: 69,
    PRO: 149,
  };
  
  const planIcons: Record<string, string> = {
    TRIAL: '⏳',
    STARTER: '⚡',
    GROWTH: '🚀',
    PRO: '💎',
  };
  
  const planColors: Record<string, string> = {
    TRIAL: '#F59E0B',
    STARTER: '#3B82F6',
    GROWTH: '#8B5CF6',
    PRO: '#06B6D4',
  };

  const handleEdit = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
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
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Cargando tu perfil...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    console.error('❌ Error loading profile:', error);
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          Error al cargar el perfil: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning">
          No se pudo cargar la información del usuario. Por favor, intenta <Button onClick={() => refetch()}>recargar</Button>.
        </Alert>
      </Container>
    );
  }

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      TRIAL: 'Prueba Gratuita',
      STARTER: 'Plan Starter',
      GROWTH: 'Plan Growth',
      PRO: 'Plan Pro',
    };
    return labels[plan] || plan;
  };
  
  const getPlanSubtitle = (plan: string) => {
    const subtitles: Record<string, string> = {
      TRIAL: 'Gratis',
      STARTER: 'El plan perfecto para empezar',
      GROWTH: 'Para equipos en crecimiento',
      PRO: 'Máxima protección y flexibilidad',
    };
    return subtitles[plan] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Activo',
      TRIAL: 'Prueba',
      CANCELED: 'Cancelado',
      PAST_DUE: 'Vencido',
      TRIALING: 'En Prueba',
    };
    return labels[status] || status;
  };

  const currentPlan = user?.subscription?.plan || 'TRIAL';
  const currentStatus = user?.subscription?.status || 'TRIALING';
  const daysRemaining = user?.subscription?.currentPeriodEnd
    ? Math.ceil((new Date(user.subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 7;
  const companiesCount = user?.companies?.length || 0;
  const companiesLimit = planLimits[currentPlan]?.domains || 1;
  const usagePercentage = Math.min((companiesCount / companiesLimit) * 100, 100);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* PROFILE HEADER - Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          p: 3,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                fontSize: '2.5rem',
                fontWeight: 700,
                border: '3px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500 }}>
                {userCompany?.name || 'Administrador'}
                {user?.email && (
                  <Typography component="span" sx={{ opacity: 0.8, fontWeight: 400, ml: 1 }}>
                    · {user.email}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <Chip
              label={`${planIcons[currentPlan]} ${getStatusLabel(currentStatus)}${currentPlan === 'TRIAL' && daysRemaining > 0 ? ` · ${daysRemaining} días` : ''}`}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.8125rem',
                px: 1.5,
                py: 1.5,
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            />
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {isEditing ? 'Cancelar edición' : 'Editar perfil'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Grid container spacing={3}>
        {/* PLAN CARD - Columna izquierda destacada */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              borderRadius: 3,
              border: `2px solid ${planColors[currentPlan]}`,
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header del plan con icono */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Rocket sx={{ color: planColors[currentPlan], fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: planColors[currentPlan] }}>
                  TU PLAN
                </Typography>
              </Box>

              {/* Nombre del plan */}
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {getPlanLabel(currentPlan)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {getPlanSubtitle(currentPlan)}
              </Typography>

              {/* Precio */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: planColors[currentPlan] }}>
                  ${planPrices[currentPlan]}
                  <Typography component="span" variant="h6" color="text.secondary">
                    {currentPlan === 'TRIAL' ? '' : ' USD/mes'}
                  </Typography>
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Barra de uso */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Uso de dominios
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: planColors[currentPlan] }}>
                    {companiesCount}/{companiesLimit === 999 ? '∞' : companiesLimit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={usagePercentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: planColors[currentPlan],
                      borderRadius: 5,
                    },
                  }}
                />
                {companiesLimit !== 999 && usagePercentage >= 80 && (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                    Estás cerca del límite de tu plan
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Lista de features */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Incluido en tu plan:
              </Typography>
              <List dense sx={{ mb: 3 }}>
                {planLimits[currentPlan]?.features.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 18, color: '#10b981', mr: 1.5 }} />
                    <ListItemText
                      primary={feature}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Alert de días restantes (solo para Trial) */}
              {currentPlan === 'TRIAL' && daysRemaining > 0 && (
                <Alert 
                  severity={daysRemaining <= 3 ? 'error' : daysRemaining <= 7 ? 'warning' : 'info'} 
                  sx={{ mb: 3 }}
                >
                  <strong>{daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}</strong> de tu prueba gratuita
                </Alert>
              )}

              {/* CTA de Upgrade */}
              {currentPlan !== 'PRO' && (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Upgrade />}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/checkout?plan=PRO')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  💎 Desbloquear protección completa
                </Button>
              )}

              {currentPlan === 'PRO' && (
                <Alert severity="success" icon={<CheckCircle />}>
                  ✨ Ya tenés el mejor plan disponible
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Próxima renovación */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {currentPlan === 'TRIAL' ? 'Período de prueba finaliza' : 'Próxima renovación'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user?.subscription?.currentPeriodEnd
                    ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'No disponible'}
                </Typography>
                {currentPlan !== 'TRIAL' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Se renovará automáticamente
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA DERECHA - Información Personal + Facturación */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {/* INFORMACIÓN PERSONAL */}
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Información Personal
                  </Typography>
                  {!isEditing && (
                    <Button
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Editar
                    </Button>
                  )}
                </Box>

                {!isEditing ? (
                  // MODO LECTURA
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Nombre completo
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user?.firstName} {user?.lastName}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Empresa
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userCompany?.name || 'Sin empresa asignada'}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user?.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        El email no puede modificarse por seguridad
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  // MODO EDICIÓN
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nombre"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Apellido"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Empresa"
                          value={userCompany?.name || 'Sin empresa'}
                          disabled
                          size="small"
                          helperText="La empresa se gestiona desde la sección de Empresas"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={user?.email || ''}
                          disabled
                          size="small"
                          helperText="El email no puede modificarse por seguridad"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        disabled={updating}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Guardar cambios
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={updating}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* FACTURACIÓN */}
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <CreditCard sx={{ color: '#3B82F6' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Facturación
                  </Typography>
                </Box>

                {user?.subscription?.mercadopagoPaymentId ? (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                        Método de pago
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: '#10B981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CreditCard sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            MercadoPago
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: ••••{user.subscription.mercadopagoPaymentId.slice(-4)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 14, color: '#10B981' }} />
                        Pagos seguros con MercadoPago
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                        Próximo cargo
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                        ${planPrices[currentPlan]} USD
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {user?.subscription?.currentPeriodEnd
                          ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString('es-AR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'No disponible'}
                      </Typography>
                      {currentPlan !== 'TRIAL' && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Aproximadamente ${Math.round(planPrices[currentPlan] * 1465).toLocaleString()} ARS
                        </Typography>
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      startIcon={<Receipt />}
                      onClick={() => setHistoryDialogOpen(true)}
                      fullWidth
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Ver historial de pagos
                    </Button>
                  </Stack>
                ) : (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Todavía no cargaste un método de pago.
                      {currentPlan === 'TRIAL' && ' Activá un plan para proteger tus dominios.'}
                    </Alert>
                    {currentPlan === 'TRIAL' && (
                      <Button
                        variant="contained"
                        startIcon={<Upgrade />}
                        onClick={() => navigate('/checkout?plan=STARTER')}
                        fullWidth
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Activar plan Starter →
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* DIALOG - Historial de Pagos */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Receipt sx={{ color: '#3B82F6' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Historial de Pagos
            </Typography>
          </Box>
          <IconButton onClick={() => setHistoryDialogOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {user?.subscription?.mercadopagoPaymentId ? (
            <List>
              <ListItem
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Plan {getPlanLabel(currentPlan)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.subscription.currentPeriodStart
                      ? new Date(user.subscription.currentPeriodStart).toLocaleDateString('es-AR')
                      : 'Fecha no disponible'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip label="Pagado" color="success" size="small" sx={{ mb: 0.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    ${planPrices[currentPlan]} USD
                  </Typography>
                </Box>
              </ListItem>
            </List>
          ) : (
            <Alert severity="info">No hay pagos registrados aún.</Alert>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
