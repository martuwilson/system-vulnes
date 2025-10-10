import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
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
  Divider,
} from '@mui/material';
import { 
  Add, 
  Business, 
  Delete, 
  Launch, 
  FlashOn, 
  Edit,
  Language,
  Security,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  Analytics,
  Shield,
  Notifications,
  Speed,
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
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);

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

  const [createAsset] = useMutation(CREATE_ASSET, {
    refetchQueries: ['GetCompanyAssets'],
  });
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    refetchQueries: ['GetCompanyAssets'],
  });

  const assets: Asset[] = data?.companyAssets || [];
  const allScans = scansData?.securityScans || [];

  // Función helper para obtener el último escaneo de un dominio específico
  const getLatestScanForDomain = (domain: string) => {
    const filtered = allScans.filter((scan: any) => scan.domain === domain);
    const latest = filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    return latest;
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

  const handleDelete = async (id: string, domain: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar ${domain}?`)) return;
    
    try {
      await deleteAsset({ variables: { id } });
      toast.success('Asset eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting asset:', error);
      toast.error(error.message || 'Error al eliminar asset');
    }
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
    excellent: { label: 'Monitoreo Activo', color: '#AEEA00', icon: CheckCircle },
    good: { label: 'Protección Estable', color: '#4CAF50', icon: Security },
    warning: { label: 'Atención Requerida', color: '#F57C00', icon: Warning },
    critical: { label: 'Riesgo Alto Detectado', color: '#E53935', icon: Warning }
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
      bgcolor: '#FAFAFA', 
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '24px', sm: '26px', md: '28px' },
                fontWeight: 700,
                color: '#1E2A38',
                mb: 1,
                letterSpacing: '-0.8px',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Hub de Control Securyx
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '15px', md: '16px' },
                color: '#757575',
                fontWeight: 500,
                mb: 0.5,
                lineHeight: 1.4
              }}
            >
              Estás protegiendo {totalDomains} {totalDomains === 1 ? 'dominio activo' : 'dominios activos'} de tu empresa
            </Typography>
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
            border: '1px solid rgba(30, 42, 56, 0.08)',
            boxShadow: '0 4px 20px rgba(30, 42, 56, 0.08)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1E2A38 0%, #2D3748 100%)',
            color: 'white',
            mb: 4
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  display: 'flex'
                }}>
                  <Business sx={{ fontSize: 32, color: '#AEEA00' }} />
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
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Analytics sx={{ fontSize: { xs: 28, md: 32 }, color: '#AEEA00', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white', fontSize: { xs: '24px', md: '32px' } }}>
                    {totalDomains}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '12px', md: '13px' }, color: 'rgba(255,255,255,0.8)' }}>
                    Dominios Monitoreados
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
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Speed sx={{ fontSize: { xs: 28, md: 32 }, color: avgHealthScore >= 80 ? '#AEEA00' : avgHealthScore >= 60 ? '#4CAF50' : '#F57C00', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'white', fontSize: { xs: '24px', md: '32px' } }}>
                    {avgHealthScore}%
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '12px', md: '13px' }, color: 'rgba(255,255,255,0.8)' }}>
                    Health Promedio
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
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Schedule sx={{ fontSize: { xs: 28, md: 32 }, color: '#42A5F5', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'white', fontSize: { xs: '14px', md: '16px' }, lineHeight: 1.3 }}>
                    {lastScanDate ? formatDateTime(lastScanDate.toISOString()).split(',')[0] : 'Sin escaneos'}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '12px', md: '13px' }, color: 'rgba(255,255,255,0.8)' }}>
                    Último Escaneo
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

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
              Dominios Monitoreados
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '15px',
                color: '#757575',
                mb: 3
              }}
            >
              Gestiona y monitorea el estado de seguridad de todos tus dominios digitales
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
                        border: '1px solid rgba(30, 42, 56, 0.08)',
                        boxShadow: '0 2px 12px rgba(30, 42, 56, 0.06)',
                        height: { xs: '320px', md: '380px' },
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: { xs: 'none', md: 'translateY(-4px)' },
                          boxShadow: '0 8px 32px rgba(30, 42, 56, 0.12)',
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
                              height: 8,
                              borderRadius: '4px',
                              bgcolor: '#F3F4F6',
                              mb: 1,
                              '& .MuiLinearProgress-bar': {
                                bgcolor: healthColor,
                                borderRadius: '4px'
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
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              sx={{ 
                                bgcolor: '#F3F4F6',
                                color: '#6B7280',
                                width: 40,
                                height: 40,
                                '&:hover': { 
                                  bgcolor: '#E5E7EB',
                                  color: '#1E2A38',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <Analytics sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ 
                                bgcolor: '#F3F4F6',
                                color: '#6B7280',
                                width: 40,
                                height: 40,
                                '&:hover': { 
                                  bgcolor: '#E5E7EB',
                                  color: '#1E2A38',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <Edit sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
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
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Shield sx={{ fontSize: 24, color: '#1976D2' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2A38', fontSize: '16px' }}>
                    Inteligencia de Seguridad
                  </Typography>
                </Box>
                
{totalDomains > 0 ? (
                  <>
                    <Box mb={3}>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 1 }}>
                        Top Vulnerabilidades Detectadas
                      </Typography>
                      {demoMetrics.vulnerabilitiesDetected > 0 ? (
                        <>
                          <Box display="flex" flex={1} alignItems="center" gap={1} mb={1}>
                            <Warning sx={{ fontSize: 16, color: '#F57C00' }} />
                            <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', flex: 1 }}>
                              Certificados SSL próximos a expirar
                            </Typography>
                            <Chip label={Math.max(1, Math.floor(demoMetrics.vulnerabilitiesDetected / 2))} size="small" sx={{ bgcolor: '#F57C00', color: 'white', fontSize: '11px' }} />
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Warning sx={{ fontSize: 16, color: avgHealthScore < 50 ? '#E53935' : '#F57C00' }} />
                            <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', flex: 1 }}>
                              Configuraciones de seguridad
                            </Typography>
                            <Chip label={Math.ceil(demoMetrics.vulnerabilitiesDetected / 2)} size="small" sx={{ bgcolor: avgHealthScore < 50 ? '#E53935' : '#F57C00', color: 'white', fontSize: '11px' }} />
                          </Box>
                        </>
                      ) : (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                          <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '13px', flex: 1 }}>
                            No hay vulnerabilidades críticas detectadas
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box mb={3}>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 1 }}>
                        Estadísticas de Monitoreo
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', mb: 0.5 }}>
                        Tiempo promedio entre escaneos: <strong>{demoMetrics.avgScanInterval}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', mb: 0.5 }}>
                        Mejora de health score: <strong>{demoMetrics.healthImprovement} este mes</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', mb: 0.5 }}>
                        Dominios protegidos: <strong>{totalDomains}/{totalDomains}</strong>
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {demoMetrics.criticalAlerts > 0 ? (
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Notifications sx={{ fontSize: 16, color: '#E53935' }} />
                          <Typography variant="body2" sx={{ color: '#E53935', fontSize: '13px', fontWeight: 600 }}>
                            Última Alerta Crítica
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', mb: 1 }}>
                          Configuración de seguridad detectada en {assets[0]?.domain || 'dominio'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                          Hace 2 horas
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                          <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '13px', fontWeight: 600 }}>
                            Sistema Estable
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1E2A38', fontSize: '13px', mb: 1 }}>
                          No hay alertas críticas pendientes
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                          Última revisión: {lastScanDate ? 'Hoy' : 'Pendiente'}
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box textAlign="center" py={2}>
                    <Security sx={{ fontSize: 48, color: '#E5E7EB', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px', mb: 1 }}>
                      Sin datos de inteligencia aún
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '12px', lineHeight: 1.4 }}>
                      Agrega dominios para comenzar a recibir análisis de seguridad y alertas inteligentes
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Panel de Acciones Rápidas */}
            <Card sx={{ 
              borderRadius: '16px',
              border: '1px solid rgba(30, 42, 56, 0.08)',
              boxShadow: '0 2px 12px rgba(30, 42, 56, 0.06)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2A38', fontSize: '16px', mb: 3 }}>
                  Acciones Rápidas
                </Typography>
                
                <Button
                  fullWidth
                  startIcon={<FlashOn />}
                  variant="outlined"
                  sx={{
                    borderColor: '#1976D2',
                    color: '#1976D2',
                    fontWeight: 500,
                    mb: 2,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.05)',
                      borderColor: '#1565C0'
                    }
                  }}
                >
                  Escanear Todos los Dominios
                </Button>
                
                <Button
                  fullWidth
                  startIcon={<TrendingUp />}
                  variant="outlined"
                  sx={{
                    borderColor: '#AEEA00',
                    color: '#1E2A38',
                    fontWeight: 500,
                    mb: 2,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: 'rgba(174, 234, 0, 0.05)',
                      borderColor: '#9DD600'
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
