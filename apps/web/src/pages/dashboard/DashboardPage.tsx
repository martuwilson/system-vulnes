import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  Security,
  Warning,
  Error,
  CheckCircle,
  Refresh,
  Shield,
  Language,
  Assessment,
  Public,
  Notifications,
  TrendingUp,
  MonitorHeart,
  Info,
  CheckCircleOutline,
  Domain
} from '@mui/icons-material';
import { HealthScoreIndicator } from '../../components/ui/HealthScoreIndicator';

import { MetricCard } from '../../components/ui/MetricCard';
// import { LoadingState } from '../../components/ui/LoadingState';
import { Toast, useToast } from '../../components/ui/Toast';
import { WelcomeCard } from '../../components/dashboard/WelcomeCard';

import { getCategoryIconByType, formatDateTime } from '../../lib/translations';

const GET_MY_COMPANIES = gql`
  query GetMyCompanies {
    myCompanies {
      id
      name
      domain
    }
  }
`;

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($companyId: String!) {
    assets(companyId: $companyId) {
      id
      domain
      isActive
      createdAt
    }
    
    securityScans(companyId: $companyId, limit: 5) {
      id
      domain
      status
      healthScore
      createdAt
      findingsCount
      criticalFindings
      highFindings
      mediumFindings
      lowFindings
    }
    
    securityFindings(companyId: $companyId, limit: 10) {
      id
      category
      severity
      title
      description
      asset {
        domain
      }
      createdAt
    }
  }
`;

interface Asset {
  id: string;
  domain: string;
  isActive: boolean;
  createdAt: string;
}

interface SecurityFinding {
  id: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  asset: {
    domain: string;
  };
  createdAt: string;
}

interface SecurityScan {
  id: string;
  domain: string;
  status: string;
  healthScore: number;
  createdAt: string;
  findingsCount: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
}

const getHealthScoreIcon = (score: number) => {
  if (score >= 90) return <CheckCircle sx={{ color: '#4CAF50' }} />;
  if (score >= 80) return <CheckCircle sx={{ color: '#8BC34A' }} />;
  if (score >= 70) return <Warning sx={{ color: '#FFC107' }} />;
  if (score >= 60) return <Warning sx={{ color: '#FF9800' }} />;
  if (score >= 40) return <Error sx={{ color: '#FF5722' }} />;
  return <Error sx={{ color: '#F44336' }} />;
};

// Función para obtener mensaje humanizado del nivel de seguridad
const getSecurityMessage = (score: number) => {
  if (score >= 95) return "¡Increíble! Tu negocio está súper protegido";
  if (score >= 90) return "¡Excelente! Seguridad de nivel empresarial";
  if (score >= 80) return "¡Muy bien! Tu negocio está bien protegido";
  if (score >= 70) return "Buen nivel, con pequeñas mejoras serás perfecto";
  if (score >= 60) return "Necesitas mejorar algunos aspectos de seguridad";
  if (score >= 40) return "Tu negocio está en riesgo, toma acción pronto";
  if (score >= 20) return "Riesgo alto - Protege tu negocio urgentemente";
  return "Riesgo crítico - Tu negocio necesita protección inmediata";
};

export function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const toast = useToast();

  // Obtener las empresas del usuario
  const { data: companiesData } = useQuery(GET_MY_COMPANIES);
  const userCompany = companiesData?.myCompanies?.[0]; // Usar la primera empresa

  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    pollInterval: 30000, // Poll every 30 seconds
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.showSuccess(
        'Hemos actualizado toda la información de seguridad de tu negocio', 
        '¡Información actualizada!'
      );
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.showError(
        'No pudimos conectar con nuestros servidores. Por favor, revisa tu conexión a internet e inténtalo de nuevo.', 
        '😔 Error de conexión'
      );
    } finally {
      setRefreshing(false);
    }
  };

  const assets: Asset[] = data?.assets || [];
  const recentScans: SecurityScan[] = data?.securityScans || [];
  const recentFindings: SecurityFinding[] = data?.securityFindings || [];

  // Calculate statistics
  const totalAssets = assets.length;
  const averageHealthScore = recentScans.length > 0 
    ? Math.round(recentScans.reduce((sum, scan) => sum + scan.healthScore, 0) / recentScans.length)
    : 0;
  
  const criticalFindings = recentFindings.filter(f => f.severity.toLowerCase() === 'critical').length;
  const highFindings = recentFindings.filter(f => f.severity.toLowerCase() === 'high').length;

  // Check if user is new (no assets and no scans)
  const isNewUser = totalAssets === 0 && recentScans.length === 0;

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{ 
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E3F2FD 100%)',
          borderRadius: 3,
          p: 4
        }}
      >
        <CircularProgress 
          size={56} 
          sx={{ 
            color: '#00B8D9',
            mb: 3
          }} 
        />
        <Box display="flex" alignItems="center" gap={1}>
          <TrendingUp sx={{ fontSize: 28, color: '#00B8D9' }} />
          <Typography variant="h6" color="#1E2A38" fontWeight="bold" gutterBottom>
            Preparando tu centro de control
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Estamos cargando la información más reciente de seguridad de tu negocio...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error"
        sx={{
          borderRadius: 2,
          backgroundColor: '#FFEBEE',
          border: '2px solid #F44336',
          '& .MuiAlert-message': { fontSize: '1rem' }
        }}
      >
        <Typography variant="h6" gutterBottom color="#1E2A38">
          😔 Ups, tenemos un problema técnico
        </Typography>
        <Typography variant="body2" color="#2D3748">
          No pudimos cargar la información de tu negocio en este momento. Nuestro equipo técnico ya está trabajando en solucionarlo.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Error técnico: {error.message}
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Welcome Card para usuarios nuevos */}
      {isNewUser && (
        <Box mb={4}>
          <WelcomeCard userCompany={userCompany} />
        </Box>
      )}
      {/* Header Humanizado para PyMEs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Security 
              sx={{ 
                fontSize: 36, 
                color: '#1E2A38' 
              }} 
            />
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                color: '#1E2A38',
                background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Centro de Control Securyx
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle sx={{ fontSize: 20, color: '#4CAF50' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                color: '#2D3748',
                fontWeight: 500
              }}
            >
              {userCompany?.name ? 
                `Todo bajo control en ${userCompany.name}` : 
                'Protegemos tu negocio digital'
              }
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Aquí puedes ver el estado de seguridad de tu empresa en tiempo real
          </Typography>
          {userCompany && (
            <Chip 
              icon={<Domain sx={{ fontSize: '1.1rem !important' }} />}
              label={`Protegiendo: ${userCompany.domain}`}
              size="medium"
              sx={{
                backgroundColor: '#E8F5E8',
                color: '#1E2A38',
                fontWeight: 600,
                border: '2px solid #AEEA00'
              }}
            />
          )}
        </Box>
        <Tooltip title="Actualizar información" arrow>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(30, 42, 56, 0.3)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #2D3748 0%, #26C6DA 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(30, 42, 56, 0.4)'
              },
              '&:disabled': { 
                background: '#E0E7FF',
                color: '#9CA3AF',
                transform: 'none'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <Refresh sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              }
            }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Métricas Clave - Simplificadas para PyMEs */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Sitios Protegidos"
            value={totalAssets}
            subtitle={
              totalAssets === 0 ? "¡Agrega tu primer sitio!" :
              totalAssets === 1 ? "Tu negocio está protegido" : 
              `${totalAssets} sitios bajo protección`
            }
            icon={<Shield />}
            gradient="linear-gradient(135deg, #1E2A38 0%, #2D3748 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Nivel de Seguridad"
            value={`${averageHealthScore}%`}
            subtitle={getSecurityMessage(averageHealthScore)}
            icon={getHealthScoreIcon(averageHealthScore)}
            gradient={
              averageHealthScore >= 80 ? "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)" :
              averageHealthScore >= 60 ? "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)" :
              "linear-gradient(135deg, #F44336 0%, #EF5350 100%)"
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Riesgos Críticos"
            value={criticalFindings}
            subtitle={
              criticalFindings === 0 ? "¡Perfecto! Sin amenazas graves" : 
              criticalFindings === 1 ? "1 riesgo crítico detectado" :
              `${criticalFindings} riesgos críticos - Acción inmediata`
            }
            icon={<Error />}
            gradient={
              criticalFindings === 0 ? "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)" :
              "linear-gradient(135deg, #F44336 0%, #EF5350 100%)"
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Alertas Importantes"
            value={highFindings}
            subtitle={
              highFindings === 0 ? "Todo bajo control" : 
              highFindings <= 3 ? `${highFindings} alertas para revisar` :
              `${highFindings} alertas - Programa revisión`
            }
            icon={<Warning />}
            gradient={
              highFindings === 0 ? "linear-gradient(135deg, #00B8D9 0%, #26C6DA 100%)" :
              highFindings <= 3 ? "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)" :
              "linear-gradient(135deg, #F57C00 0%, #FF9800 100%)"
            }
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Sitios Web Protegidos - Simplificado */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #E3F2FD'
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Public sx={{ fontSize: 24, color: '#1E2A38' }} />
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      color: '#1E2A38'
                    }}
                  >
                    Mis Sitios Web
                  </Typography>
                </Box>
                <Chip 
                  label={
                    assets.filter(a => a.isActive).length === 0 ? 'Ninguno activo' :
                    assets.filter(a => a.isActive).length === 1 ? '1 sitio protegido' :
                    `${assets.filter(a => a.isActive).length} sitios protegidos`
                  }
                  size="small" 
                  sx={{
                    backgroundColor: assets.filter(a => a.isActive).length > 0 ? '#E8F5E8' : '#FFF3E0',
                    color: assets.filter(a => a.isActive).length > 0 ? '#2E7D32' : '#F57C00',
                    fontWeight: 600,
                    border: assets.filter(a => a.isActive).length > 0 ? '1px solid #AEEA00' : '1px solid #FFB74D'
                  }}
                />
              </Box>
              
              {assets.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#F0F9FF',
                    border: '2px solid #00B8D9',
                    borderRadius: 2
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <TrendingUp sx={{ fontSize: 20, color: '#00B8D9' }} />
                      <Typography variant="subtitle1" fontWeight="bold" color="#1E2A38">
                        ¡Empecemos a proteger tu negocio!
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="#2D3748" sx={{ mt: 1 }}>
                      Agrega el dominio de tu sitio web (ej: miempresa.com) para comenzar a monitorear su seguridad las 24 horas del día.
                    </Typography>
                  </Box>
                </Alert>
              ) : (
                <List>
                  {assets.map((asset) => (
                    <ListItem 
                      key={asset.id} 
                      divider 
                      sx={{ 
                        py: 2.5,
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: '#F8FAFC',
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: asset.isActive 
                              ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
                              : 'linear-gradient(135deg, #F57C00 0%, #FF9800 100%)',
                            color: 'white'
                          }}
                        >
                          <Language />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="subtitle1" fontWeight="600" color="#1E2A38">
                              {asset.domain}
                            </Typography>
                            <Chip
                              icon={asset.isActive ? 
                                <CheckCircleOutline sx={{ fontSize: '1rem !important' }} /> : 
                                <Warning sx={{ fontSize: '1rem !important' }} />
                              }
                              label={asset.isActive ? 'Protegido' : 'Pausado'}
                              size="small"
                              sx={{
                                backgroundColor: asset.isActive ? '#E8F5E8' : '#FFF3E0',
                                color: asset.isActive ? '#1B5E20' : '#E65100',
                                fontWeight: 600,
                                border: asset.isActive ? '1px solid #AEEA00' : '1px solid #FFB74D'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                              {asset.isActive ? (
                                <>
                                  <MonitorHeart sx={{ fontSize: 16, color: '#4CAF50' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Monitoreo activo las 24/7
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <Warning sx={{ fontSize: 16, color: '#FF9800' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Monitoreo pausado
                                  </Typography>
                                </>
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Agregado el {formatDateTime(asset.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas de Seguridad - Humanizado */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #E3F2FD'
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    color: '#1E2A38'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Notifications sx={{ fontSize: 24, color: '#F44336' }} />
                    Alertas de Seguridad
                  </Box>
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  {recentFindings.length > 0 && (
                    <Chip 
                      label={
                        recentFindings.length === 1 ? '1 alerta' :
                        `${recentFindings.length} alertas`
                      }
                      size="small" 
                      sx={{
                        backgroundColor: recentFindings.length === 0 ? '#E8F5E8' : '#FFF3E0',
                        color: recentFindings.length === 0 ? '#2E7D32' : '#F57C00',
                        fontWeight: 600,
                        border: recentFindings.length === 0 ? '1px solid #AEEA00' : '1px solid #FFB74D'
                      }}
                    />
                  )}
                  {recentFindings.length > 5 && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Prioridad</InputLabel>
                      <Select
                        value={severityFilter}
                        label="Prioridad"
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="all">Todas las alertas</MenuItem>
                        <MenuItem value="critical">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Error sx={{ fontSize: 16, color: '#F44336' }} />
                            Críticas
                          </Box>
                        </MenuItem>
                        <MenuItem value="high">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Warning sx={{ fontSize: 16, color: '#F57C00' }} />
                            Importantes
                          </Box>
                        </MenuItem>
                        <MenuItem value="medium">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Assessment sx={{ fontSize: 16, color: '#FF9800' }} />
                            Moderadas
                          </Box>
                        </MenuItem>
                        <MenuItem value="low">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Info sx={{ fontSize: 16, color: '#2196F3' }} />
                            Informativas
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>
              
              {recentFindings.length === 0 ? (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#F1F8E9',
                    border: '2px solid #AEEA00',
                    borderRadius: 2
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle sx={{ color: '#4CAF50' }} />
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircle sx={{ fontSize: 20, color: '#4CAF50' }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="#1E2A38">
                          ¡Felicidades! Tu negocio está seguro
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="#2D3748" sx={{ mt: 0.5 }}>
                        No hemos detectado amenazas en tus sitios web. Securyx está trabajando las 24 horas para mantener tu empresa protegida.
                      </Typography>
                    </Box>
                  </Box>
                </Alert>
              ) : (
                <List>
                  {[...recentFindings]
                    .filter(finding => 
                      severityFilter === 'all' || 
                      finding.severity.toLowerCase() === severityFilter
                    )
                    .sort((a, b) => {
                      // Ordenar por prioridad: críticas > importantes > moderadas > informativas
                      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                      return (severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder] || 0) - 
                             (severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] || 0);
                    })
                    .slice(0, 5)
                    .map((finding) => {
                      // Humanizar títulos técnicos
                      const humanizedTitle = finding.title
                        .replace(/SSL\/TLS/g, 'Certificado de Seguridad')
                        .replace(/XSS/g, 'Seguridad del Navegador')
                        .replace(/SQL Injection/g, 'Seguridad de Datos')
                        .replace(/CSRF/g, 'Protección de Formularios');

                      // Traducir severidad a términos de negocio
                      const businessSeverity = {
                        critical: { label: 'Crítico', icon: <Error sx={{ fontSize: 14 }} />, color: '#F44336', bg: '#FFEBEE' },
                        high: { label: 'Importante', icon: <Warning sx={{ fontSize: 14 }} />, color: '#F57C00', bg: '#FFF3E0' },
                        medium: { label: 'Revisar', icon: <Assessment sx={{ fontSize: 14 }} />, color: '#FF9800', bg: '#FFF8E1' },
                        low: { label: 'Informativo', icon: <Info sx={{ fontSize: 14 }} />, color: '#2196F3', bg: '#E3F2FD' }
                      };

                      const severity = businessSeverity[finding.severity.toLowerCase() as keyof typeof businessSeverity] || 
                                     businessSeverity.medium;

                      return (
                        <ListItem 
                          key={finding.id} 
                          divider 
                          sx={{ 
                            py: 2.5,
                            borderRadius: 2,
                            mb: 1,
                            backgroundColor: severity.bg,
                            border: `1px solid ${severity.color}20`,
                            '&:hover': {
                              transform: 'translateX(4px)',
                              boxShadow: `0 4px 12px ${severity.color}20`,
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Box 
                              sx={{ 
                                fontSize: '2em',
                                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
                              }}
                            >
                              {getCategoryIconByType(finding.category)}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Typography variant="subtitle1" fontWeight="600" color="#1E2A38">
                                  {humanizedTitle}
                                </Typography>
                                <Chip
                                  icon={severity.icon}
                                  label={severity.label}
                                  size="small"
                                  sx={{
                                    backgroundColor: severity.color,
                                    color: 'white',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': {
                                      color: 'white !important'
                                    }
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 0.5 }}>
                                  <Domain sx={{ fontSize: 16, color: '#00B8D9' }} />
                                  <Typography variant="body2" sx={{ color: '#2D3748', fontWeight: 500 }}>
                                    {finding.asset.domain}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Detectado el {formatDateTime(finding.createdAt)}
                                </Typography>
                                <Tooltip 
                                  title={`Detalles técnicos: ${finding.description}`}
                                  arrow
                                  enterDelay={500}
                                >
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontSize: '0.875rem',
                                      cursor: 'help',
                                      color: '#546E7A',
                                      mt: 0.5,
                                      '&:hover': { textDecoration: 'underline' }
                                    }}
                                  >
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                      <Info sx={{ fontSize: 14, color: '#546E7A' }} />
                                      <span>Clic aquí para ver más detalles técnicos</span>
                                    </Box>
                                  </Typography>
                                </Tooltip>
                              </Box>
                            }
                          />
                        </ListItem>
                      );
                    })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Historial de Análisis - Humanizado */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #E3F2FD'
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    color: '#1E2A38',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Assessment sx={{ fontSize: 20, color: '#1E2A38' }} />
                    Historial de Análisis
                  </Box>
                </Typography>
                {recentScans.length > 0 && (
                  <Chip 
                    label={
                      recentScans.length === 1 ? '1 análisis realizado' :
                      `${recentScans.length} análisis realizados`
                    }
                    size="small" 
                    sx={{
                      backgroundColor: '#E3F2FD',
                      color: '#1E2A38',
                      fontWeight: 600,
                      border: '1px solid #00B8D9'
                    }}
                  />
                )}
              </Box>
              
              {recentScans.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#F0F9FF',
                    border: '2px solid #00B8D9',
                    borderRadius: 2
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="#1E2A38">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Assessment sx={{ fontSize: 20, color: '#00B8D9' }} />
                        ¡Realiza tu primer análisis de seguridad!
                      </Box>
                    </Typography>
                    <Typography variant="body2" color="#2D3748" sx={{ mt: 1 }}>
                      Ve a la sección de "Análisis" para revisar la seguridad de tus sitios web. Te mostramos qué tan seguro está tu negocio y qué mejoras puedes hacer.
                    </Typography>
                  </Box>
                </Alert>
              ) : (
                <List>
                  {recentScans.map((scan) => {
                    // Traducir estado a términos de negocio
                    const businessStatus = {
                      'COMPLETED': { label: 'Completado', icon: <CheckCircle sx={{ fontSize: 14 }} />, color: '#4CAF50', bg: '#E8F5E8' },
                      'RUNNING': { label: 'Analizando...', icon: <TrendingUp sx={{ fontSize: 14 }} />, color: '#00B8D9', bg: '#E3F2FD' },
                      'FAILED': { label: 'Error', icon: <Error sx={{ fontSize: 14 }} />, color: '#F44336', bg: '#FFEBEE' },
                      'PENDING': { label: 'En espera', icon: <Warning sx={{ fontSize: 14 }} />, color: '#FF9800', bg: '#FFF3E0' }
                    };

                    const status = businessStatus[scan.status as keyof typeof businessStatus] || 
                                 businessStatus.PENDING;

                    // Humanizar conteo de vulnerabilidades
                    const getVulnMessage = (count: number) => {
                      if (count === 0) return '¡Ningún problema detectado!';
                      if (count === 1) return '1 punto de mejora encontrado';
                      if (count <= 5) return `${count} puntos de mejora encontrados`;
                      return `${count} problemas de seguridad detectados`;
                    };

                    return (
                      <ListItem 
                        key={scan.id} 
                        divider 
                        sx={{ 
                          py: 3,
                          borderRadius: 2,
                          mb: 2,
                          backgroundColor: status.bg,
                          border: `1px solid ${status.color}20`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 6px 20px ${status.color}20`,
                            transition: 'all 0.3s ease-in-out'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `linear-gradient(135deg, ${status.color} 0%, ${status.color}80 100%)`,
                              color: 'white'
                            }}
                          >
                            <Security />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Assessment sx={{ fontSize: 18, color: '#1E2A38' }} />
                                <Typography variant="subtitle1" fontWeight="600" color="#1E2A38">
                                  Análisis de {scan.domain}
                                </Typography>
                              </Box>
                              <Chip
                                icon={status.icon}
                                label={status.label}
                                size="small"
                                sx={{
                                  backgroundColor: status.color,
                                  color: 'white',
                                  fontWeight: 600,
                                  '& .MuiChip-icon': {
                                    color: 'white !important'
                                  }
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#2D3748', fontWeight: 500, mb: 1 }}>
                                {getVulnMessage(scan.findingsCount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Análisis realizado el {formatDateTime(scan.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box textAlign="center">
                            <Typography variant="caption" color="text.secondary">
                              Nivel de Seguridad
                            </Typography>
                            <HealthScoreIndicator 
                              score={scan.healthScore} 
                              size="medium" 
                              showLabel={true}
                              showProgress={true}
                            />
                          </Box>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toast notifications */}
      <Toast
        open={toast.open}
        onClose={toast.hideToast}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </Box>
  );
}
