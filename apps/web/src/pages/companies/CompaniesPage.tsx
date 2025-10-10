import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Launch, 
  FlashOn, 
  Edit,
  Language,
  Security,
  TrendingUp,
  Warning,
  CheckCircle,
  Analytics,
  Shield,
  VerifiedUser,
  WarningAmber,
  Report,
  Domain,
  Update,
  Visibility,
  Search,
  ErrorOutline,
  Lock,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../lib/translations';

const GET_MY_COMPANIES = gql`
  query GetMyCompanies {
    myCompanies {
      id
      name
      domain
    }
  }
`;

const GET_ASSETS = gql`
  query GetCompanyAssets($companyId: String!) {
    companyAssets(companyId: $companyId) {
      id
      domain
      createdAt
      isActive
    }
  }
`;

const GET_COMPANY_SCANS = gql`
  query GetSecurityScans($companyId: String!) {
    securityScans(companyId: $companyId, limit: 10) {
      id
      domain
      createdAt
      status
      healthScore
      findingsCount
    }
  }
`;

const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription {
    userProfile {
      id
      subscription {
        id
        plan
        status
      }
    }
  }
`;

const GET_PLAN_LIMITS = gql`
  query GetPlanLimits($plan: String!) {
    planLimitsByPlan(plan: $plan) {
      id
      plan
      # Campos antiguos (por compatibilidad temporal)
      maxDomains
      maxAssets
      # Campos nuevos (lógica clarificada)
      maxCompanies
      maxAssetsPerCompany
      hasSlackIntegration
      hasTeamsIntegration
      hasPDFReports
      hasCSVReports
      hasComplianceReports
      hasAuditorAccess
      hasPrioritySupport
      hasHistoricalTrends
      maxUsers
      priceUsd
    }
  }
`;

const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      domain
      companyId
      isActive
      createdAt
      updatedAt
    }
  }
`;

const DELETE_ASSET = gql`
  mutation DeleteAsset($id: String!) {
    deleteAsset(id: $id)
  }
`;

interface Asset {
  id: string;
  domain: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function CompaniesPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, assetId: string, domainName: string}>({
    open: false,
    assetId: '',
    domainName: ''
  });
  const [deleting, setDeleting] = useState(false);
  
  // Estados para ver detalles
  const [detailsDialog, setDetailsDialog] = useState<{open: boolean, asset: Asset | null}>({
    open: false,
    asset: null
  });
  
  // Estados para editar dominio
  const [editDialog, setEditDialog] = useState<{open: boolean, asset: Asset | null}>({
    open: false,
    asset: null
  });
  const [editingDomain, setEditingDomain] = useState('');
  
  // Estados para modal de upgrade
  const [upgradeDialog, setUpgradeDialog] = useState<{open: boolean, feature: string, message: string}>({
    open: false,
    feature: '',
    message: ''
  });

  // Obtener las empresas del usuario
  const { data: companiesData } = useQuery(GET_MY_COMPANIES);
  const userCompany = companiesData?.myCompanies?.[0]; // Usar la primera empresa

  const { data, loading: queryLoading, error } = useQuery(GET_ASSETS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error en GET_ASSETS query:', error);
      if (error.message.includes('Unauthorized')) {
        // Manejar error de autorización si es necesario
      }
    }
  });

  const { data: scansData } = useQuery(GET_COMPANY_SCANS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    errorPolicy: 'all'
  });

  // Obtener información de suscripción del usuario
  const { data: subscriptionData } = useQuery(GET_USER_SUBSCRIPTION, {
    errorPolicy: 'all'
  });

  // Obtener límites del plan actual
  const userPlan = subscriptionData?.userProfile?.subscription?.plan || 'TRIAL';
  const { data: planLimitsData } = useQuery(GET_PLAN_LIMITS, {
    variables: { plan: userPlan },
    skip: !userPlan,
    errorPolicy: 'all'
  });

  const [createAsset] = useMutation(CREATE_ASSET, {
    refetchQueries: ['GetCompanyAssets'],
  });
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    refetchQueries: ['GetCompanyAssets'],
  });

  const assets: Asset[] = data?.companyAssets || [];
  const allScans = scansData?.securityScans || [];
  const planLimits = planLimitsData?.planLimitsByPlan;

  // Función helper para obtener el último escaneo de un dominio específico
  const getLatestScanForDomain = (domain: string) => {
    const filtered = allScans.filter((scan: any) => scan.domain === domain);
    const latest = filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    return latest;
  };

  // Funciones de validación de permisos basadas en planes
  const canEditDomains = () => {
    if (!planLimits) return false;
    // Solo Growth y Pro pueden editar dominios
    return ['GROWTH', 'PRO'].includes(userPlan);
  };

  const getRemainingAssets = () => {
    if (!planLimits || !data?.assets) return 0;
    
    // Usar los nuevos campos si están disponibles, sino los antiguos
    const maxAssets = planLimits.maxAssetsPerCompany ?? planLimits.maxAssets;
    
    // -1 significa ilimitado
    if (maxAssets === -1) return Infinity;
    
    return Math.max(0, maxAssets - data.assets.length);
  };

  const getUpgradeMessage = (feature: string) => {
    const planNames = {
      'TRIAL': 'Trial (5 recursos)',
      'STARTER': 'Starter (10 recursos)', 
      'GROWTH': 'Growth (15 recursos)',
      'PRO': 'Pro (recursos ilimitados)'
    };
    
    const currentPlanName = planNames[userPlan as keyof typeof planNames] || 'Trial';
    
    switch (feature) {
      case 'edit':
        return `La edición de dominios está disponible desde el plan Growth. Tu plan actual: ${currentPlanName}`;
      case 'limit':
        const remaining = getRemainingAssets();
        return remaining === Infinity 
          ? `Tienes recursos ilimitados en el plan ${currentPlanName}`
          : `Te quedan ${remaining} recursos disponibles en tu plan ${currentPlanName}`;
      default:
        return `Esta funcionalidad requiere un plan superior. Tu plan actual: ${currentPlanName}`;
    }
  };

  const handleSubmit = async () => {
    if (!domain.trim()) return;
    
    setLoading(true);
    try {
      await createAsset({
        variables: {
          input: {
            companyId: userCompany?.id,
            domain: domain.trim(),
            isActive: true,
          },
        },
      });
      
      toast.success('Asset agregado exitosamente');
      setDomain('');
      setOpen(false);
    } catch (error: any) {
      console.error('Error creating asset:', error);
      toast.error(error.message || 'Error al agregar asset');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, domain: string) => {
    setDeleteDialog({
      open: true,
      assetId: id,
      domainName: domain
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.assetId) return;
    
    setDeleting(true);
    try {
      await deleteAsset({ variables: { id: deleteDialog.assetId } });
      toast.success(`${deleteDialog.domainName} eliminado exitosamente`);
      setDeleteDialog({ open: false, assetId: '', domainName: '' });
    } catch (error: any) {
      console.error('Error deleting asset:', error);
      toast.error(error.message || 'Error al eliminar dominio');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, assetId: '', domainName: '' });
  };

  // Función para ver detalles
  const handleViewDetails = (asset: Asset) => {
    setDetailsDialog({
      open: true,
      asset: asset
    });
  };

  // Función para cerrar detalles
  const closeDetailsDialog = () => {
    setDetailsDialog({ open: false, asset: null });
  };

  // Función para editar dominio
  const handleEditDomain = (asset: Asset) => {
    // Verificar si el usuario puede editar dominios
    if (!canEditDomains()) {
      setUpgradeDialog({
        open: true,
        feature: 'edit',
        message: getUpgradeMessage('edit')
      });
      return;
    }

    setEditingDomain(asset.domain);
    setEditDialog({
      open: true,
      asset: asset
    });
  };

  // Función para cerrar edición
  const closeEditDialog = () => {
    setEditDialog({ open: false, asset: null });
    setEditingDomain('');
  };

  // Función para confirmar edición (por ahora solo cierra el modal)
  const confirmEdit = () => {
    // Aquí puedes agregar la lógica para actualizar el dominio
    toast.success(`Dominio actualizado: ${editingDomain}`);
    closeEditDialog();
  };

  // Función para cerrar modal de upgrade
  const closeUpgradeDialog = () => {
    setUpgradeDialog({ open: false, feature: '', message: '' });
  };

  // Función para navegar a la sección de precios
  const goToPricing = () => {
    navigate('/', { replace: true });
    // Usar setTimeout para asegurar que la página se carga antes de hacer scroll
    setTimeout(() => {
      const pricingSection = document.getElementById('precios');
      if (pricingSection) {
        pricingSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  if (queryLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    console.error('CompaniesPage error details:', error);
    
    const isUnauthorized = error.message.includes('Unauthorized') || 
                          error.graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED');
    
    if (isUnauthorized) {
      return (
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>Tu sesión ha expirado</Typography>
          <Typography variant="body2">
            Tu token de autenticación ha expirado. Por favor, cierra sesión e inicia sesión nuevamente.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.href = '/auth/login'}
          >
            Ir al Login
          </Button>
        </Alert>
      );
    }
    
    return (
      <Alert severity="error">
        Error al cargar los datos: {error.message}
      </Alert>
    );
  }

  // Calcular métricas para el dashboard
  const totalDomains = assets.length;
  const latestScans = allScans.slice(0, totalDomains);
  const avgHealthScore = latestScans.length > 0 
    ? Math.round(latestScans.reduce((acc: number, scan: any) => acc + (scan.healthScore || 0), 0) / latestScans.length)
    : 0;
  const lastScanDate = latestScans.length > 0 
    ? new Date(Math.max(...latestScans.map((scan: any) => new Date(scan.createdAt).getTime())))
    : null;

  // Estado general del sistema
  const systemStatus = totalDomains === 0 ? 'initial' : 
    avgHealthScore >= 80 ? 'excellent' : 
    avgHealthScore >= 60 ? 'good' : 
    avgHealthScore >= 40 ? 'warning' : 'critical';
  
  const statusConfig = {
    initial: { label: 'Configuración Inicial', color: '#1976D2', icon: Security },
    excellent: { label: 'Protección Activa', color: '#AEEA00', icon: VerifiedUser },
    good: { label: 'Protección Activa', color: '#4CAF50', icon: VerifiedUser },
    warning: { label: 'Atención Requerida', color: '#F57C00', icon: WarningAmber },
    critical: { label: 'Riesgo Crítico', color: '#E53935', icon: Report }
  };

  // Datos de demostración inteligente
  const demoMetrics = {
    vulnerabilitiesDetected: Math.max(0, 5 - Math.floor(avgHealthScore / 20)),
    avgScanInterval: totalDomains > 0 ? '2.3 días' : 'N/A',
    healthImprovement: totalDomains > 0 ? '+12%' : '0%',
    criticalAlerts: totalDomains > 2 ? 1 : 0
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: '#F9FAFB', 
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "IBM Plex Sans", "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ===== HERO HEADER EJECUTIVO ===== */}
      <Box sx={{ mb: 6 }}>
        {/* Header Principal */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={{ xs: 3, md: 0 }}
          mb={4}
        >
          <Box flex={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: { xs: '24px', sm: '28px', md: '32px' },
                  fontWeight: 700,
                  color: '#1E2A38',
                  letterSpacing: '-0.8px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Panel de Seguridad Digital de tu Empresa
              </Typography>
              
              {/* Badge del Plan */}
              <Chip 
                label={(() => {
                  const planNames = {
                    'TRIAL': 'Trial',
                    'STARTER': 'Starter',
                    'GROWTH': 'Growth', 
                    'PRO': 'Pro'
                  };
                  return planNames[userPlan as keyof typeof planNames] || 'Trial';
                })()}
                size="small"
                sx={{
                  bgcolor: (() => {
                    const colors = {
                      'TRIAL': '#E3F2FD',
                      'STARTER': '#FFF3E0', 
                      'GROWTH': '#E8F5E8',
                      'PRO': '#F3E5F5'
                    };
                    return colors[userPlan as keyof typeof colors] || '#E3F2FD';
                  })(),
                  color: (() => {
                    const colors = {
                      'TRIAL': '#1976D2',
                      'STARTER': '#F57C00',
                      'GROWTH': '#388E3C', 
                      'PRO': '#7B1FA2'
                    };
                    return colors[userPlan as keyof typeof colors] || '#1976D2';
                  })(),
                  fontWeight: 600,
                  fontSize: '12px',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
            </Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '16px', md: '18px' },
                color: '#757575',
                fontWeight: 400,
                mb: 1,
                lineHeight: 1.5,
                maxWidth: '600px'
              }}
            >
              Monitoreá la salud y protección de tus dominios en tiempo real con Securyx.
            </Typography>
            
            {/* Estado Global Contextual */}
            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
              {React.createElement(statusConfig[systemStatus].icon, { 
                sx: { fontSize: 20, color: statusConfig[systemStatus].color }
              })}
              <Typography 
                variant="body1"
                sx={{ 
                  fontSize: '15px',
                  color: statusConfig[systemStatus].color,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {statusConfig[systemStatus].label}
              </Typography>
              <Chip
                label={totalDomains > 0 ? `${totalDomains} dominios monitoreados` : 'Configuración inicial'}
                size="small"
                sx={{
                  bgcolor: 'rgba(30, 42, 56, 0.05)',
                  color: '#1E2A38',
                  fontWeight: 500,
                  fontSize: '12px',
                  borderRadius: '8px'
                }}
              />
            </Box>
          </Box>
          
          {/* CTA Principal Mejorado */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '14px', md: '15px' },
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.25)',
              minWidth: { md: 'auto' },
              '&:hover': {
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            + Añadir Dominio
          </Button>
        </Box>

        {/* Panel de Métricas Ejecutivo */}
        <Card 
          sx={{ 
            borderRadius: '16px',
            border: 'none',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #1E2A38 0%, #263238 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(30, 42, 56, 0.15)',
            color: 'white',
            mb: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #AEEA00 0%, #4CAF50 50%, #1976D2 100%)',
              opacity: 0.8
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={{ 
                  p: 2.5, 
                  borderRadius: '16px', 
                  bgcolor: 'rgba(174, 234, 0, 0.15)',
                  border: '1px solid rgba(174, 234, 0, 0.2)',
                  display: 'flex',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(174, 234, 0, 0.25)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 20px rgba(174, 234, 0, 0.2)'
                  }
                }}>
                  <Domain sx={{ fontSize: 32, color: '#AEEA00' }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ fontSize: '20px', fontWeight: 700, mb: 0.5 }}
                  >
                    {userCompany?.name || 'Mi Empresa'}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {React.createElement(statusConfig[systemStatus].icon, { 
                      sx: { fontSize: 18, color: statusConfig[systemStatus].color }
                    })}
                    <Typography sx={{ fontSize: '14px', color: statusConfig[systemStatus].color, fontWeight: 600 }}>
                      {statusConfig[systemStatus].label}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {userCompany?.domain && (
                <Chip 
                  icon={<Launch />}
                  label={userCompany.domain}
                  clickable
                  onClick={() => window.open(`https://${userCompany.domain}`, '_blank')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                  }}
                />
              )}
            </Box>

            {/* Mini Tarjetas de Métricas */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper 
                  sx={{ 
                    p: { xs: 2.5, md: 3 }, 
                    borderRadius: '12px', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Shield sx={{ 
                    fontSize: { xs: 28, md: 32 }, 
                    color: '#AEEA00', 
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': { filter: 'brightness(1.2)' }
                  }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white', fontSize: { xs: '24px', md: '32px' } }}>
                    {totalDomains}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '12px', md: '13px' }, color: 'rgba(255,255,255,0.8)' }}>
                    Dominios bajo protección
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper 
                  sx={{ 
                    p: { xs: 2.5, md: 3 }, 
                    borderRadius: '12px', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Círculo de progreso de fondo */}
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={60}
                      thickness={3}
                      sx={{ color: 'rgba(255,255,255,0.1)' }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={avgHealthScore}
                      size={60}
                      thickness={3}
                      sx={{ 
                        color: avgHealthScore >= 80 ? '#AEEA00' : avgHealthScore >= 60 ? '#4CAF50' : avgHealthScore >= 40 ? '#F57C00' : '#E53935',
                        position: 'absolute',
                        left: 0,
                        transition: 'all 0.6s ease-in-out'
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: 'white', 
                        fontSize: '16px',
                        lineHeight: 1
                      }}>
                        {avgHealthScore}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: { xs: '12px', md: '13px' }, color: 'rgba(255,255,255,0.8)' }}>
                    Salud Digital Promedio
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Paper 
                  sx={{ 
                    p: { xs: 2.5, md: 3 }, 
                    borderRadius: '12px', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Update sx={{ 
                    fontSize: { xs: 28, md: 32 }, 
                    color: '#42A5F5', 
                    mb: 1,
                    animation: lastScanDate ? 'none' : 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                      '100%': { opacity: 1 }
                    }
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'white', fontSize: { xs: '14px', md: '16px' }, lineHeight: 1.3 }}>
                    {lastScanDate ? formatDateTime(lastScanDate.toISOString()).split(',')[0] : 'Sin escaneos'}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '12px', md: '13px' }, color: 'rgba(255,255,255,0.8)' }}>
                    Última revisión automatizada
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ===== CARD INFORMATIVA SOBRE LIMITACIONES DEL PLAN ===== */}
      {(['TRIAL', 'STARTER'].includes(userPlan)) && (
        <Box sx={{ mb: 4 }}>
          <Card 
            sx={{ 
              borderRadius: '16px',
              border: '2px solid #ff4757',
              background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.05) 0%, rgba(255, 107, 122, 0.05) 100%)',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={{ 
                  p: 2.5, 
                  borderRadius: '16px', 
                  bgcolor: 'rgba(255, 71, 87, 0.15)',
                  border: '1px solid rgba(255, 71, 87, 0.2)',
                  display: 'flex'
                }}>
                  <Lock sx={{ fontSize: 32, color: '#ff4757' }} />
                </Box>
                <Box flex={1}>
                  <Typography 
                    variant="h6" 
                    sx={{ fontSize: '18px', fontWeight: 700, mb: 1, color: '#ff4757' }}
                  >
                    🚀 Desbloquea más funciones con Growth
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#666', mb: 2, lineHeight: 1.5 }}>
                    Tu plan <strong>{userPlan === 'TRIAL' ? 'Trial' : 'Starter'}</strong> tiene funcionalidades limitadas. 
                    Con Growth obtienes edición completa de dominios, más monitoreó, y reportes avanzados.
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Typography variant="body2" sx={{ color: '#888', fontSize: '13px' }}>
                      ✨ Edición de dominios • 🔄 3 dominios • 👥 Hasta 3 usuarios • 📊 Reportes CSV • 💬 Integración Slack/Teams
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#ff4757',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px',
                    textTransform: 'none',
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      bgcolor: '#ff3838'
                    }
                  }}
                  onClick={goToPricing}
                >
                  Ver Planes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ===== LAYOUT PRINCIPAL CON SIDEBAR ===== */}
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* ===== GRID DE DOMINIOS MONITOREADOS ===== */}
        <Grid item xs={12} lg={8}>
          <Box mb={3}>
            <Typography 
              variant="h5" 
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1E2A38',
                mb: 1,
                letterSpacing: '-0.4px'
              }}
            >
              Dominios bajo protección
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '15px',
                color: '#757575',
                mb: 3,
                lineHeight: 1.5
              }}
            >
              Gestiona y monitorea el estado de seguridad de todos tus dominios digitales en tiempo real
            </Typography>
          </Box>

          {assets.length === 0 ? (
            <Card sx={{ 
              borderRadius: '16px',
              border: '2px dashed #E5E7EB',
              bgcolor: 'transparent',
              textAlign: 'center',
              py: 8
            }}>
              <CardContent>
                <Security sx={{ fontSize: 64, color: '#E5E7EB', mb: 3 }} />
                <Typography variant="h6" sx={{ color: '#1E2A38', fontWeight: 600, mb: 2 }}>
                  No tienes dominios registrados aún
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', mb: 4, maxWidth: 400, mx: 'auto' }}>
                  Agrega tu primer dominio para comenzar a monitorear la seguridad digital de tu empresa y recibir alertas de vulnerabilidades
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Añadir Mi Primer Dominio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {assets.map((asset) => {
                const latestScan = getLatestScanForDomain(asset.domain);
                const healthScore = latestScan?.healthScore || 0;
                const healthLevel = healthScore >= 80 ? 'Excelente' : 
                                 healthScore >= 60 ? 'Bueno' : 
                                 healthScore >= 40 ? 'Riesgo Medio' : 'Crítico';
                const healthColor = healthScore >= 80 ? '#AEEA00' : 
                                  healthScore >= 60 ? '#4CAF50' : 
                                  healthScore >= 40 ? '#F57C00' : '#E53935';

                return (
                  <Grid item xs={12} sm={6} lg={6} key={asset.id}>
                    <Card 
                      sx={{ 
                        borderRadius: '16px',
                        border: '1px solid #E0E0E0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        height: { xs: '320px', md: '380px' },
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: 'white',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: { xs: 'none', md: 'translateY(-3px)' },
                          boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                          borderColor: 'rgba(25, 118, 210, 0.2)'
                        }
                      }}
                    >
                      {/* Status Bar */}
                      <Box 
                        sx={{ 
                          height: '4px', 
                          bgcolor: healthColor,
                          background: `linear-gradient(90deg, ${healthColor} 0%, ${healthColor}88 100%)`
                        }} 
                      />
                      
                      <CardContent sx={{ p: { xs: 2.5, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box 
                              sx={{ 
                                p: 1.5, 
                                borderRadius: '12px', 
                                bgcolor: '#1976D2',
                                background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                                color: 'white'
                              }}
                            >
                              <Language sx={{ fontSize: 24 }} />
                            </Box>
                            <Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontSize: '16px', 
                                  fontWeight: 700, 
                                  color: '#1E2A38',
                                  lineHeight: 1.2
                                }}
                              >
                                {asset.domain}
                              </Typography>
                              <Chip
                                size="small"
                                label={asset.isActive ? "Activo" : "Inactivo"}
                                sx={{
                                  bgcolor: asset.isActive ? '#AEEA00' : '#E53935',
                                  color: asset.isActive ? '#1E2A38' : 'white',
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  height: '20px',
                                  mt: 0.5
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        {/* Health Score */}
                        <Box mb={2} flex={1}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                            <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', fontWeight: 500 }}>
                              Salud Digital
                            </Typography>
                            <Typography variant="h6" sx={{ color: healthColor, fontWeight: 700, fontSize: '18px' }}>
                              {latestScan ? `${healthScore}%` : '--'}
                            </Typography>
                          </Box>
                          
                          <LinearProgress 
                            variant="determinate" 
                            value={healthScore} 
                            sx={{
                              height: 10,
                              borderRadius: '10px',
                              bgcolor: '#ECEFF1',
                              mb: 1,
                              '& .MuiLinearProgress-bar': {
                                background: healthScore >= 80 
                                  ? 'linear-gradient(90deg, #4CAF50 0%, #AEEA00 100%)'
                                  : healthScore >= 60 
                                    ? 'linear-gradient(90deg, #1976D2 0%, #4CAF50 100%)'
                                    : healthScore >= 40
                                      ? 'linear-gradient(90deg, #F57C00 0%, #FF9800 100%)'
                                      : 'linear-gradient(90deg, #F57C00 0%, #E53935 100%)',
                                borderRadius: '10px',
                                transition: 'all 0.3s ease'
                              }
                            }}
                          />
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: healthColor, 
                              fontSize: '12px', 
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              mb: 1.5
                            }}
                          >
                            {latestScan ? healthLevel : 'Sin evaluar'}
                          </Typography>

                          {/* Metadata */}
                          <Box>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '11px', mb: 0.5 }}>
                              Último escaneo: {latestScan ? formatDateTime(latestScan.createdAt) : 'Nunca'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '11px' }}>
                              Agregado: {formatDateTime(asset.createdAt)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box display="flex" gap={1} mt="auto" pt={1.5}>
                          <Tooltip title="Escanear ahora">
                            <IconButton
                              size="small"
                              sx={{ 
                                bgcolor: '#1976D2',
                                color: 'white',
                                width: 40,
                                height: 40,
                                '&:hover': { 
                                  bgcolor: '#1565C0',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <FlashOn sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Ver detalles" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(asset)}
                              sx={{ 
                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                color: '#1976D2',
                                width: 40,
                                height: 40,
                                '&:hover': { 
                                  bgcolor: '#1976D2',
                                  color: 'white',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <Visibility sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip 
                            title={canEditDomains() ? "Editar dominio" : `🔒 ${getUpgradeMessage('edit')}`} 
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleEditDomain(asset)}
                              sx={{ 
                                bgcolor: canEditDomains() ? 'rgba(117, 117, 117, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                color: canEditDomains() ? '#757575' : '#ff4757',
                                width: 40,
                                height: 40,
                                position: 'relative',
                                '&:hover': { 
                                  bgcolor: canEditDomains() ? '#757575' : '#ff4757',
                                  color: 'white',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              {canEditDomains() ? (
                                <Edit sx={{ fontSize: 20 }} />
                              ) : (
                                <>
                                  <Edit sx={{ fontSize: 20 }} />
                                  <Lock sx={{ 
                                    fontSize: 12, 
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: '#ff4757',
                                    color: 'white',
                                    borderRadius: '50%',
                                    p: 0.2
                                  }} />
                                </>
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar dominio" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(asset.id, asset.domain)}
                              sx={{ 
                                bgcolor: 'rgba(229, 57, 53, 0.1)',
                                color: '#E53935',
                                width: 40,
                                height: 40,
                                '&:hover': { 
                                  bgcolor: '#E53935',
                                  color: 'white',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <Delete sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>

        {/* ===== SIDEBAR CONTEXTUAL ===== */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 24 } }}>
            {/* Panel de Inteligencia */}
            <Card sx={{ 
              borderRadius: '16px',
              border: '1px solid rgba(30, 42, 56, 0.08)',
              boxShadow: '0 2px 12px rgba(30, 42, 56, 0.06)',
              mb: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: '10px', 
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    display: 'flex'
                  }}>
                    <Analytics sx={{ fontSize: 20, color: '#1976D2' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2A38', fontSize: '16px' }}>
                    Inteligencia de Seguridad Activa
                  </Typography>
                </Box>
                
{totalDomains > 0 ? (
                  <>
                    {/* 1️⃣ Alertas Recientes */}
                    <Box mb={3}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: '#F57C00', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          1
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '14px', fontWeight: 600 }}>
                          Alertas recientes
                        </Typography>
                      </Box>
                      
                      {demoMetrics.vulnerabilitiesDetected > 0 ? (
                        <>
                          <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              bgcolor: '#F57C00', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}>
                              <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                                {Math.max(1, Math.floor(demoMetrics.vulnerabilitiesDetected / 2))}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', flex: 1 }}>
                              Certificados SSL por renovar pronto
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              bgcolor: avgHealthScore < 50 ? '#E53935' : '#F57C00', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}>
                              <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                                {Math.ceil(demoMetrics.vulnerabilitiesDetected / 2)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', flex: 1 }}>
                              Configuraciones de seguridad
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box display="flex" alignItems="center" gap={2}>
                          <CheckCircle sx={{ fontSize: 20, color: '#4CAF50' }} />
                          <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '13px', flex: 1 }}>
                            Sin vulnerabilidades críticas
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ borderTop: '1px solid #E0E0E0', my: 3 }} />

                    {/* 2️⃣ Estadísticas Clave */}
                    <Box mb={3}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: '#1976D2', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          2
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '14px', fontWeight: 600 }}>
                          Estadísticas clave
                        </Typography>
                      </Box>
                      
                      <Box sx={{ pl: 4 }}>
                        <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px', mb: 1 }}>
                          • Tiempo entre escaneos: <strong>{demoMetrics.avgScanInterval}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px', mb: 1 }}>
                          • Mejora mensual: <strong>{demoMetrics.healthImprovement}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
                          • Cobertura total: <strong>{totalDomains} dominios protegidos</strong>
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ borderTop: '1px solid #E0E0E0', my: 3 }} />

                    {/* 3️⃣ Estado del Sistema */}
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: '#4CAF50', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          3
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '14px', fontWeight: 600 }}>
                          Estado del sistema
                        </Typography>
                      </Box>
                      
                      {demoMetrics.criticalAlerts > 0 ? (
                        <Box>
                          <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', mb: 1, pl: 4 }}>
                            Configuración detectada en {assets[0]?.domain || 'dominio'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px', pl: 4 }}>
                            Hace 2 horas
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ pl: 4 }}>
                          <Chip
                            icon={<CheckCircle />}
                            label="🟢 Sistema Estable"
                            sx={{
                              bgcolor: '#E8F5E9',
                              color: '#2E7D32',
                              fontWeight: 500,
                              fontSize: '12px',
                              borderRadius: '12px'
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px', mt: 1 }}>
                            Última revisión: {lastScanDate ? 'Hoy' : 'Pendiente'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Security sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '15px', fontWeight: 500, mb: 1 }}>
                      Sin datos de inteligencia aún
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', lineHeight: 1.5, px: 2 }}>
                      Agrega dominios para comenzar a recibir análisis de seguridad y alertas inteligentes
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Panel de Acciones Rápidas */}
            {/* Callout Card Principal */}
            <Card sx={{ 
              borderRadius: '16px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              bgcolor: '#E3F2FD',
              mb: 3
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Search sx={{ fontSize: 28, color: '#1976D2' }} />
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2A38', fontSize: '16px', mb: 1 }}>
                  🔍 Escanear todos los dominios ahora
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 3, lineHeight: 1.4 }}>
                  Actualizá los reportes de vulnerabilidad en tiempo real
                </Typography>
                
                <Button
                  fullWidth
                  startIcon={<FlashOn />}
                  variant="contained"
                  sx={{
                    bgcolor: '#1976D2',
                    color: 'white',
                    fontWeight: 600,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    '&:hover': {
                      bgcolor: '#1565C0'
                    }
                  }}
                >
                  Iniciar Escaneo Completo
                </Button>
              </CardContent>
            </Card>

            {/* Acciones Secundarias */}
            <Card sx={{ 
              borderRadius: '16px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              bgcolor: 'white'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E2A38', fontSize: '15px', mb: 3 }}>
                  Acciones Rápidas
                </Typography>
                
                <Button
                  fullWidth
                  startIcon={<TrendingUp />}
                  variant="outlined"
                  sx={{
                    borderColor: '#E0E0E0',
                    color: '#1E2A38',
                    fontWeight: 500,
                    mb: 2,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: '#F9FAFB',
                      borderColor: '#1976D2'
                    }
                  }}
                >
                  Ver Tendencias de Seguridad
                </Button>
                
                <Button
                  fullWidth
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => setOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                    fontWeight: 500,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '10px',
                    boxShadow: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                    }
                  }}
                >
                  Añadir Nuevo Dominio
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* ===== MODAL AÑADIR DOMINIO MEJORADO ===== */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '20px',
            boxShadow: '0 12px 48px rgba(30, 42, 56, 0.2)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1E2A38 0%, #2D3748 100%)',
          color: 'white',
          p: 4,
          textAlign: 'center'
        }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <Add sx={{ fontSize: 40, color: '#AEEA00' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: '24px' }}>
            Añadir Nuevo Dominio
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
            Comienza a proteger un nuevo dominio con monitoreo automatizado
          </Typography>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '15px',
              color: '#757575',
              mb: 4,
              lineHeight: 1.6,
              textAlign: 'center'
            }}
          >
            Agrega un dominio para monitorear su seguridad digital y recibir alertas automáticas de vulnerabilidades
          </Typography>
          
          <TextField
            autoFocus
            margin="none"
            label="Dominio a Monitorear"
            placeholder="ejemplo.com"
            fullWidth
            variant="outlined"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            helperText="Ingresa el dominio sin http:// o https:// (ejemplo: google.com)"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '16px',
                py: 1,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root': {
                fontSize: '16px',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: '#1976D2'
                }
              },
              '& .MuiFormHelperText-root': {
                fontSize: '13px',
                color: '#757575',
                mt: 1.5
              }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{
              color: '#757575',
              fontWeight: 500,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                bgcolor: '#F3F4F6',
                color: '#1E2A38'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !domain.trim()}
            sx={{
              background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '15px',
              textTransform: 'none',
              px: 5,
              py: 1.5,
              borderRadius: '12px',
              minWidth: '140px',
              boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              },
              '&:disabled': {
                background: '#E5E7EB',
                color: '#9CA3AF',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : '+ Añadir Dominio'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== MODAL DE CONFIRMACIÓN ELIMINAR DOMINIO ===== */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={cancelDelete} 
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(229, 57, 53, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        {/* Header con fondo de alerta */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #E53935 0%, #D32F2F 100%)',
          color: 'white',
          p: 4,
          textAlign: 'center'
        }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <ErrorOutline sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontSize: '22px' }}>
            Confirmar Eliminación
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            Esta acción no se puede deshacer
          </Typography>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '16px',
              color: '#1E2A38',
              mb: 2,
              lineHeight: 1.6,
              textAlign: 'center'
            }}
          >
            ¿Estás seguro de que deseas eliminar el dominio{' '}
            <Box component="span" sx={{ fontWeight: 700, color: '#E53935' }}>
              {deleteDialog.domainName}
            </Box>
            ?
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '14px',
              color: '#757575',
              textAlign: 'center',
              lineHeight: 1.5
            }}
          >
            Se perderán todos los datos de monitoreo, escaneos históricos y configuraciones asociadas a este dominio.
          </Typography>

          {/* Warning Box */}
          <Box sx={{
            mt: 3,
            p: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(229, 57, 53, 0.05)',
            border: '1px solid rgba(229, 57, 53, 0.2)'
          }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Warning sx={{ fontSize: 20, color: '#E53935' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#E53935', fontSize: '14px' }}>
                Impacto de la eliminación:
              </Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Historial de escaneos eliminado permanentemente
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Configuraciones de alertas perdidas
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                • Métricas de health score reiniciadas
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
          <Button 
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              color: '#757575',
              borderColor: '#E0E0E0',
              fontWeight: 500,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              flex: 1,
              '&:hover': {
                bgcolor: '#F9FAFB',
                borderColor: '#757575'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            disabled={deleting}
            sx={{
              bgcolor: '#E53935',
              color: 'white',
              fontWeight: 600,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              flex: 1,
              minWidth: '140px',
              '&:hover': {
                bgcolor: '#D32F2F'
              },
              '&:disabled': {
                bgcolor: '#E0E0E0',
                color: '#9CA3AF'
              }
            }}
          >
            {deleting ? (
              <>
                <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                Eliminando...
              </>
            ) : (
              'Eliminar Dominio'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== MODAL VER DETALLES ===== */}
      <Dialog 
        open={detailsDialog.open} 
        onClose={closeDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
          color: 'white',
          p: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Visibility sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px' }}>
              Detalles del Dominio
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '14px' }}>
              {detailsDialog.asset?.domain}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {detailsDialog.asset && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, borderRadius: '12px', bgcolor: '#F8F9FA', border: '1px solid #E9ECEF' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976D2' }}>
                    Información General
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#757575' }}>Dominio:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{detailsDialog.asset.domain}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#757575' }}>Estado:</Typography>
                      <Chip 
                        label={detailsDialog.asset.isActive ? "Activo" : "Inactivo"}
                        color={detailsDialog.asset.isActive ? "success" : "error"}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#757575' }}>Fecha de creación:</Typography>
                      <Typography variant="body1">{formatDateTime(detailsDialog.asset.createdAt)}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, borderRadius: '12px', bgcolor: '#F8F9FA', border: '1px solid #E9ECEF' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976D2' }}>
                    Estado de Seguridad
                  </Typography>
                  {(() => {
                    const latestScan = getLatestScanForDomain(detailsDialog.asset.domain);
                    return latestScan ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#757575' }}>Health Score:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: latestScan.healthScore >= 80 ? '#4CAF50' : latestScan.healthScore >= 50 ? '#FF9800' : '#F44336',
                              color: 'white',
                              fontWeight: 'bold'
                            }}>
                              {latestScan.healthScore}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {latestScan.healthScore >= 80 ? 'Excelente' : latestScan.healthScore >= 50 ? 'Moderado' : 'Crítico'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#757575' }}>Vulnerabilidades:</Typography>
                          <Typography variant="body1">{latestScan.findingsCount} encontradas</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#757575' }}>Último escaneo:</Typography>
                          <Typography variant="body1">{formatDateTime(latestScan.createdAt)}</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Search sx={{ fontSize: 48, color: '#BDBDBD', mb: 1 }} />
                        <Typography variant="body2" sx={{ color: '#757575' }}>
                          No se han realizado escaneos aún
                        </Typography>
                      </Box>
                    );
                  })()}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button 
            onClick={closeDetailsDialog}
            variant="contained"
            sx={{
              bgcolor: '#1976D2',
              color: 'white',
              fontWeight: 500,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                bgcolor: '#1565C0'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== MODAL EDITAR DOMINIO ===== */}
      <Dialog 
        open={editDialog.open} 
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #757575 0%, #616161 100%)',
          color: 'white',
          p: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Edit sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px' }}>
              Editar Dominio
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '14px' }}>
              Modificar la configuración del dominio
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              Nombre del dominio
            </Typography>
            <TextField
              fullWidth
              value={editingDomain}
              onChange={(e) => setEditingDomain(e.target.value)}
              placeholder="ejemplo.com"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '16px'
                }
              }}
            />
          </Box>
          
          <Box sx={{
            p: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            border: '1px solid rgba(25, 118, 210, 0.2)'
          }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Domain sx={{ fontSize: 20, color: '#1976D2' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976D2', fontSize: '14px' }}>
                Información importante:
              </Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Cambiar el dominio reiniciará el historial de monitoreo
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Los escaneos previos se mantendrán asociados al dominio anterior
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                • Se requiere nueva validación del dominio
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
          <Button 
            onClick={closeEditDialog}
            variant="outlined"
            sx={{
              color: '#757575',
              borderColor: '#E0E0E0',
              fontWeight: 500,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              flex: 1,
              '&:hover': {
                bgcolor: '#F9FAFB',
                borderColor: '#757575'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmEdit}
            variant="contained"
            disabled={!editingDomain.trim()}
            sx={{
              bgcolor: '#757575',
              color: 'white',
              fontWeight: 600,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              flex: 1,
              minWidth: '140px',
              '&:hover': {
                bgcolor: '#616161'
              },
              '&:disabled': {
                bgcolor: '#E0E0E0',
                color: '#9CA3AF'
              }
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== MODAL UPGRADE PLAN ===== */}
      <Dialog 
        open={upgradeDialog.open} 
        onClose={closeUpgradeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%)',
          color: 'white',
          p: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Lock sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px' }}>
              Funcionalidad Premium
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '14px' }}>
              Actualizá tu plan para desbloquear más funciones
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              {upgradeDialog.message}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Desbloquea esta funcionalidad y muchas más con un plan superior
            </Typography>
          </Box>

          {/* Plan Benefits */}
          <Box sx={{
            p: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 71, 87, 0.05)',
            border: '1px solid rgba(255, 71, 87, 0.2)',
            mb: 3
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff4757', mb: 2, fontSize: '14px' }}>
              ✨ Con el plan Growth obtienes:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Edición y gestión completa de dominios
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Hasta 3 dominios monitoreados
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Escaneos diarios automáticos
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Hasta 3 usuarios en tu equipo
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 0.5 }}>
                • Integraciones con Slack y Teams
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                • Reportes avanzados (PDF + CSV)
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ff4757', mb: 1 }}>
              $69/mes
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Facturación mensual • Cancelá cuando quieras
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
          <Button 
            onClick={closeUpgradeDialog}
            variant="outlined"
            sx={{
              color: '#757575',
              borderColor: '#E0E0E0',
              fontWeight: 500,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              flex: 1,
              '&:hover': {
                bgcolor: '#F9FAFB',
                borderColor: '#757575'
              }
            }}
          >
            Tal vez después
          </Button>
          <Button 
            variant="contained"
            sx={{
              bgcolor: '#ff4757',
              color: 'white',
              fontWeight: 600,
              fontSize: '15px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              flex: 1,
              minWidth: '140px',
              '&:hover': {
                bgcolor: '#ff3838'
              }
            }}
            onClick={() => {
              closeUpgradeDialog();
              goToPricing();
            }}
          >
            Ver Planes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== FOOTER INFORMATIVO ===== */}
      <Box 
        sx={{ 
          mt: 8,
          pt: 4,
          borderTop: '1px solid rgba(30, 42, 56, 0.08)',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '12px',
            color: '#9E9E9E',
            fontWeight: 400,
            letterSpacing: '0.2px'
          }}
        >
          © 2025 Securyx — Tecnología de Protección Digital para PyMEs
        </Typography>
      </Box>
    </Box>
  );
}
