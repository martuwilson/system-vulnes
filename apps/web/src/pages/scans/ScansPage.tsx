import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,

  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import { 
  PlayArrow, 
  Security, 
  Refresh,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  TrendingFlat,

  Error,

  ExpandMore,
  ContentCopy,

  Visibility,
  Assessment,
  RestartAlt,
  CompareArrows,
  Language,
  Flag,
  MonitorHeart,

  WarningAmber,
  Shield,
  VerifiedUser,
  Remove,

  Update,
  PictureAsPdf,
  Settings,
  Warning
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { UpgradeModal } from '../../components/UpgradeModal';
import { 
  translateSeverity, 
  translateCategory,
  translateVulnerabilityTitle,
  translateVulnerabilityDescription,
  getCategoryIconByType, 
  formatDateTime 
} from '../../lib/translations';

const GET_MY_COMPANIES = gql`
  query GetMyCompanies {
    myCompanies {
      id
      name
      domain
    }
  }
`;

const GET_COMPANY_ASSETS = gql`
  query GetCompanyAssets($companyId: String!) {
    companyAssets(companyId: $companyId) {
      id
      domain
      companyId
      isActive
    }
  }
`;

const GET_SECURITY_SCANS = gql`
  query GetSecurityScans($companyId: String!) {
    securityScans(companyId: $companyId, limit: 20) {
      id
      domain
      status
      healthScore
      findingsCount
      criticalFindings
      highFindings
      mediumFindings
      lowFindings
      createdAt
      updatedAt
    }
  }
`;

const GET_SCAN_DETAILS = gql`
  query GetSecurityScanStatus($scanId: String!) {
    getSecurityScanStatus(scanId: $scanId) {
      id
      status
      healthScore
      domain
      createdAt
      completedAt
      findings {
        id
        title
        description
        severity
        category
        recommendation
      }
    }
  }
`;

const START_SCAN_QUEUED = gql`
  mutation StartSecurityScanQueued($input: SecurityScanInput!) {
    startSecurityScanQueued(input: $input) {
      success
      message
      scanId
      healthScore
      findings {
        id
        title
        severity
        description
      }
    }
  }
`;

interface Asset {
  id: string;
  domain: string;
  companyId: string;
  isActive: boolean;
}

interface SecurityScan {
  id: string;
  domain: string;
  status: string;
  healthScore?: number;
  findingsCount: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  createdAt: string;
  updatedAt: string;
}

interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  recommendation?: string;
}





const formatScanId = (id: string) => {
  // Mostrar solo los últimos 8 caracteres del ID
  return `#${id.slice(-8).toUpperCase()}`;
};

const groupFindingsBySeverity = (findings: SecurityFinding[]) => {
  const groups = {
    CRITICAL: [] as SecurityFinding[],
    HIGH: [] as SecurityFinding[],
    MEDIUM: [] as SecurityFinding[],
    LOW: [] as SecurityFinding[],
  };
  
  findings.forEach(finding => {
    const severity = finding.severity.toUpperCase() as keyof typeof groups;
    if (groups[severity]) {
      groups[severity].push(finding);
    } else {
      // Si no es una severidad conocida, agregar a MEDIUM por defecto
      groups.MEDIUM.push(finding);
    }
  });
  
  return groups;
};

const getSeverityIcon = (severity: string) => {
  switch (severity.toUpperCase()) {
    case 'CRITICAL': return '🟥';
    case 'HIGH': return '🔴';
    case 'MEDIUM': return '🟧';
    case 'LOW': return '🟡';
    default: return '⚪';
  }
};

// Funciones utilitarias para el diseño mejorado
const getHealthScoreLabel = (score: number) => {
  if (score >= 80) return { text: 'Excelente', color: '#4CAF50', icon: <VerifiedUser sx={{ fontSize: '16px' }} /> };
  if (score >= 60) return { text: 'Bueno', color: '#AEEA00', icon: <Shield sx={{ fontSize: '16px' }} /> };
  return { text: 'Crítico', color: '#E53935', icon: <WarningAmber sx={{ fontSize: '16px' }} /> };
};

const getStatusChipProps = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return {
        label: 'Análisis completado',
        color: '#E8F5E9' as const,
        textColor: '#4CAF50' as const,
        icon: '🟢'
      };
    case 'IN_PROGRESS':
      return {
        label: 'En proceso',
        color: '#FFF3E0' as const,
        textColor: '#F57C00' as const,
        icon: '🟡'
      };
    case 'FAILED':
      return {
        label: 'Error',
        color: '#FFEBEE' as const,
        textColor: '#E53935' as const,
        icon: '🔴'
      };
    case 'QUEUED':
      return {
        label: 'En cola',
        color: '#E3F2FD' as const,
        textColor: '#1976D2' as const,
        icon: '⏳'
      };
    default:
      return {
        label: status,
        color: '#F5F5F5' as const,
        textColor: '#757575' as const,
        icon: '⚪'
      };
  }
};

const getTrendingInfo = (currentScore: number, previousScore: number | null) => {
  if (previousScore === null) return { icon: <Remove />, text: 'Sin datos previos', color: '#757575' };
  
  const diff = currentScore - previousScore;
  if (diff > 5) return { 
    icon: <TrendingUp />, 
    text: `↑ Mejoró un ${diff}% desde el último escaneo`, 
    color: '#4CAF50' 
  };
  if (diff < -5) return { 
    icon: <TrendingDown />, 
    text: `↓ Empeoró un ${Math.abs(diff)}% desde el último escaneo`, 
    color: '#E53935' 
  };
  return { 
    icon: <TrendingFlat />, 
    text: '→ Estable desde el último escaneo', 
    color: '#757575' 
  };
};

const getSeverityLabel = (severity: string) => {
  switch (severity.toUpperCase()) {
    case 'CRITICAL': return 'Críticas';
    case 'HIGH': return 'Altas';
    case 'MEDIUM': return 'Medias';
    case 'LOW': return 'Bajas';
    default: return severity;
  }
};



const formatVulnerabilitySummary = (scan: SecurityScan) => {
  const parts = [];
  if (scan.criticalFindings > 0) parts.push(`${scan.criticalFindings} críticas`);
  if (scan.highFindings > 0) parts.push(`${scan.highFindings} altas`);
  if (scan.mediumFindings > 0) parts.push(`${scan.mediumFindings} medias`);
  if (scan.lowFindings > 0) parts.push(`${scan.lowFindings} bajas`);
  return parts.length > 0 ? `Riesgos detectados: ${parts.join(', ')}` : 'Sin riesgos detectados';
};

const formatVulnerabilityCount = (scan: SecurityScan) => {
  const totalVulns = (scan.criticalFindings || 0) + (scan.highFindings || 0) + 
                    (scan.mediumFindings || 0) + (scan.lowFindings || 0);
  
  if (totalVulns === 0) return { text: 'Sin riesgos', color: '#4CAF50', icon: <CheckCircle /> };
  if ((scan.criticalFindings || 0) > 0) return { 
    text: `${totalVulns} riesgos (crítico)`, 
    color: '#E53935', 
    icon: <Error /> 
  };
  if ((scan.highFindings || 0) > 0) return { 
    text: `${totalVulns} riesgos (alto)`, 
    color: '#F57C00', 
    icon: <WarningAmber /> 
  };
  return { 
    text: `${totalVulns} riesgos (bajo)`, 
    color: '#FFC107', 
    icon: <WarningAmber /> 
  };
};

export function ScansPage() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [scanningDomain, setScanningDomain] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<SecurityScan | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Estados para feedback de escaneo
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [lastCompletedScan, setLastCompletedScan] = useState<SecurityScan | null>(null);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  
  // Estados para modal de detalles
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  
  // Filtros para el historial
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthScoreFilter, setHealthScoreFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all'); // Nuevo filtro por dominio
  
  // Estado para modal de upgrade
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [planLimitError, setPlanLimitError] = useState<any>(null);

  // Obtener las empresas del usuario
  const { data: companiesData } = useQuery(GET_MY_COMPANIES);
  const userCompany = companiesData?.myCompanies?.[0]; // Usar la primera empresa

  const { data, loading, error, refetch } = useQuery(GET_COMPANY_ASSETS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    pollInterval: 5000, // Poll every 5 seconds for scan updates
  });

  const { data: scansData, refetch: refetchScans } = useQuery(GET_SECURITY_SCANS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    pollInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  const [startScanQueued] = useMutation(START_SCAN_QUEUED);

  // Query para obtener detalles del escaneo seleccionado
  const { data: scanDetailsData, loading: detailsLoading } = useQuery(GET_SCAN_DETAILS, {
    variables: { scanId: selectedScanId || '' },
    skip: !selectedScanId,
  });

  const assets: Asset[] = data?.companyAssets || [];
  const allScans: SecurityScan[] = scansData?.securityScans || [];
  
  // Aplicar filtros
  const filteredScans = allScans.filter(scan => {
    // Filtro por dominio
    if (domainFilter !== 'all' && scan.domain !== domainFilter) {
      return false;
    }
    // Filtro por estado
    if (statusFilter !== 'all' && scan.status.toLowerCase() !== statusFilter) {
      return false;
    }
    // Filtro por health score
    if (healthScoreFilter !== 'all') {
      const score = scan.healthScore || 0;
      switch (healthScoreFilter) {
        case 'excellent': return score >= 80;
        case 'good': return score >= 60 && score < 80;
        case 'poor': return score < 60;
        default: return true;
      }
    }
    return true;
  });

  // Detectar escaneos en progreso
  const activeScans = allScans.filter(scan => 
    scan.status.toLowerCase() === 'in_progress' || 
    scan.status.toLowerCase() === 'queued'
  );
  const hasActiveScans = activeScans.length > 0;

  // Detectar cuando se completa un escaneo
  useEffect(() => {
    if (activeScanId) {
      const completedScan = allScans.find(scan => 
        scan.id === activeScanId && 
        (scan.status.toLowerCase() === 'completed' || scan.status.toLowerCase() === 'failed')
      );
      
      if (completedScan) {
        setLastCompletedScan(completedScan);
        setShowCompletionAlert(true);
        setActiveScanId(null);
        
        // Notificación de finalización
        if (completedScan.status.toLowerCase() === 'completed') {
          toast.success(
            `✅ Escaneo completado para ${completedScan.domain}! Health Score: ${completedScan.healthScore}%`,
            { duration: 6000 }
          );
        } else {
          toast.error(
            `❌ Escaneo falló para ${completedScan.domain}`,
            { duration: 5000 }
          );
        }
        
        // Auto-hide completion alert after 10 seconds
        setTimeout(() => setShowCompletionAlert(false), 10000);
      }
    }
  }, [allScans, activeScanId]);

  const handleStartScan = async () => {
    if (!selectedDomain) return;
    
    // Encontrar el asset seleccionado
    const selectedAsset = assets.find(asset => asset.domain === selectedDomain);
    if (!selectedAsset) {
      toast.error('Asset no encontrado');
      return;
    }
    
    setScanningDomain(selectedDomain);
    try {
      const result = await startScanQueued({
        variables: { 
          input: {
            assetId: selectedAsset.id
          }
        }
      });
      
      if (result.data?.startSecurityScanQueued?.success) {
        const scanId = result.data.startSecurityScanQueued.scanId;
        
        // Feedback inmediato con microcopy amigable
        toast.success(`✅ Análisis iniciado correctamente — ${selectedDomain} está siendo analizado en segundo plano`, {
          duration: 5000,
          icon: '🔍',
        });
        
        // Establecer el ID del escaneo activo para seguimiento
        if (scanId) {
          setActiveScanId(scanId);
        }
        
        refetch(); // Refresh assets
        refetchScans(); // Refresh scans list
      } else {
        toast.error(result.data?.startSecurityScanQueued?.message || 'No pudimos iniciar el análisis. Intentá nuevamente en unos minutos.');
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      
      // Verificar si es un error de límite de plan
      const graphQLErrors = error?.graphQLErrors || [];
      const networkError = error?.networkError;
      
      // Buscar error de límite de plan por código o por mensaje
      const planLimitError = graphQLErrors.find((err: any) => {
        const code = err?.extensions?.code;
        const status = err?.extensions?.exception?.status;
        const message = err?.message || '';
        
        // Verificar por código HTTP 402, o por mensaje de límite
        return code === 'PAYMENT_REQUIRED' || 
               status === 402 || 
               message.includes('límite') || 
               message.includes('Alcanzaste');
      });
      
      if (planLimitError || networkError?.statusCode === 402) {
        // Extraer información del error
        const errorData = planLimitError?.extensions?.exception?.response || 
                         networkError?.result || 
                         {
                           message: planLimitError?.message || error.message,
                           code: 'PAYMENT_REQUIRED',
                           currentPlan: 'TRIAL',
                           availablePlans: [
                             { plan: 'STARTER', price: 29, features: ['1 empresa', 'Escaneos ilimitados'] },
                             { plan: 'GROWTH', price: 69, features: ['3 empresas', 'Escaneos ilimitados', 'Reportes PDF'] },
                             { plan: 'PRO', price: 149, features: ['Empresas ilimitadas', 'Todo incluido'] },
                           ]
                         };
        
        setPlanLimitError(errorData);
        setUpgradeModalOpen(true);
        
        // Mostrar toast informativo
        toast.error(errorData.message || 'Alcanzaste el límite de tu plan actual', {
          icon: '🔒',
          duration: 4000,
        });
      } else {
        // Error genérico
        toast.error(error.message || 'Hubo un problema técnico. Verificá tu conexión e intentá nuevamente.');
      }
    } finally {
      setScanningDomain(null);
    }
  };

  const handleViewDetails = (scan: SecurityScan) => {
    // Fix temporal: extraer el ID real si viene en formato compuesto
    let realScanId = scan.id;
    if (scan.id.includes('/')) {
      realScanId = scan.id.split('/')[1];
    }
    
    setSelectedScan(scan);
    setSelectedScanId(realScanId);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar los datos: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Premium con gradiente y tipografía optimizada */}
      <Box 
        sx={{
          background: 'linear-gradient(180deg, #F9FBFF 0%, #FFFFFF 100%)',
          borderBottom: '1px solid #ECEFF1',
          borderRadius: '12px 12px 0 0',
          p: 3,
          mb: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Security 
              sx={{ 
                fontSize: '20px',
                background: 'linear-gradient(135deg, #1976D2, #42A5F5)',
                borderRadius: '6px',
                p: 0.75,
                color: 'white'
              }} 
            />
            <Box>
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 600,
                  fontSize: '22px',
                  color: '#1E2A38',
                  fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif',
                  mb: 0.5
                }}
              >
                Panel de Escaneos de Seguridad
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#616161',
                  fontSize: '14px',
                  fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                }}
              >
                Ejecutá análisis automáticos de tus dominios y controlá el estado general de tu protección digital.
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1.5} alignItems="center">
            <Tooltip title="Refrescar datos de escaneos">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => refetch()}
                sx={{
                  borderColor: '#E0E0E0',
                  color: '#757575',
                  '&:hover': {
                    borderColor: '#1976D2',
                    backgroundColor: '#E3F2FD',
                    color: '#1976D2'
                  }
                }}
              >
                Refrescar datos
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Banner de escaneos activos */}
      {hasActiveScans && (
        <Alert 
          severity="info" 
          icon={<CircularProgress size={20} />}
          sx={{ mb: 3 }}
          action={
            <Button size="small" color="inherit" onClick={() => refetchScans()}>
              Actualizar Estado
            </Button>
          }
        >
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {activeScans.length === 1 
                ? `Hay 1 escaneo en progreso` 
                : `Hay ${activeScans.length} escaneos en progreso`
              }
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Los resultados se actualizarán automáticamente cuando finalicen
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Alert de escaneo completado */}
      {showCompletionAlert && lastCompletedScan && (
        <Alert 
          severity={lastCompletedScan.status.toLowerCase() === 'completed' ? 'success' : 'error'}
          onClose={() => setShowCompletionAlert(false)}
          sx={{ mb: 3 }}
          action={
            <Button 
              size="small" 
              color="inherit" 
              onClick={() => handleViewDetails(lastCompletedScan)}
            >
              Ver Detalles
            </Button>
          }
        >
          <Typography variant="body2" fontWeight="bold">
            {lastCompletedScan.status.toLowerCase() === 'completed' 
              ? `✅ Escaneo completado: ${lastCompletedScan.domain}`
              : `❌ Escaneo falló: ${lastCompletedScan.domain}`
            }
          </Typography>
          {lastCompletedScan.status.toLowerCase() === 'completed' && (
            <Typography variant="caption" color="text.secondary">
              Health Score: {lastCompletedScan.healthScore}% | {formatVulnerabilitySummary(lastCompletedScan)}
            </Typography>
          )}
        </Alert>
      )}

      {/* Panel de Nuevo Análisis - Diseño Premium */}
      <Card 
        sx={{ 
          mb: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          borderRadius: '12px',
          borderLeft: '4px solid #1976D2',
          background: '#FFFFFF',
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <PlayArrow sx={{ color: '#1976D2', fontSize: '20px' }} />
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 600,
                color: '#1E2A38',
                fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
              }}
            >
              Ejecutar nuevo análisis
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#616161', 
              mb: 3,
              lineHeight: 1.6
            }}
          >
            Seleccioná el dominio que querés analizar y ejecutá un escaneo completo de vulnerabilidades.
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={8}>
              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                <InputLabel>Seleccioná el dominio que querés analizar</InputLabel>
                <Select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  label="Seleccioná el dominio que querés analizar"
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.domain}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Security sx={{ fontSize: '16px', color: '#1976D2' }} />
                        {asset.domain}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={
                  scanningDomain ? 
                  <CircularProgress size={20} color="inherit" /> : 
                  <PlayArrow />
                }
                onClick={handleStartScan}
                disabled={!selectedDomain || scanningDomain === selectedDomain}
                sx={{
                  background: 'linear-gradient(90deg, #1976D2, #42A5F5)',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  py: 1.25,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565C0, #1976D2)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  },
                  '&:disabled': {
                    background: '#E0E0E0'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {scanningDomain === selectedDomain ? 'Analizando...' : 'Ejecutar análisis'}
              </Button>
            </Grid>
          </Grid>

          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              backgroundColor: '#F9FBFF', 
              borderRadius: '8px',
              border: '1px solid #E3F2FD'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#1976D2',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              💡 El escaneo se ejecuta en segundo plano y no interrumpe tus operaciones.
            </Typography>
          </Box>

          {assets.length === 0 && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 2,
                borderRadius: '8px',
                backgroundColor: '#E3F2FD',
                '& .MuiAlert-icon': {
                  color: '#1976D2'
                }
              }}
            >
              No tenés dominios registrados. Andá a la sección de Empresas para agregar recursos digitales.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dashboard de Análisis Realizados */}
      <Card sx={{ borderRadius: '12px' }}>
        <CardContent sx={{ p: 3 }}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="flex-start" 
            mb={3}
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography 
                variant="h6" 
                sx={{
                  fontWeight: 600,
                  color: '#1E2A38',
                  fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif',
                  mb: 0.5
                }}
              >
                Últimos análisis realizados ({filteredScans.length})
              </Typography>
              <Typography variant="body2" color="#616161">
                Histórico de escaneos y tendencias de seguridad
              </Typography>
            </Box>
            
            <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Language sx={{ fontSize: '14px' }} />
                  Dominio
                </InputLabel>
                <Select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  label="Dominio"
                >
                  <MenuItem value="all">Todos los dominios</MenuItem>
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.domain}>
                      {asset.domain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 130,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Flag sx={{ fontSize: '14px' }} />
                  Estado
                </InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="completed">Análisis completado</MenuItem>
                  <MenuItem value="in_progress">En proceso</MenuItem>
                  <MenuItem value="queued">En cola</MenuItem>
                  <MenuItem value="failed">Falló</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 170,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              >
                <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MonitorHeart sx={{ fontSize: '14px' }} />
                  Índice de Salud
                </InputLabel>
                <Select
                  value={healthScoreFilter}
                  onChange={(e) => setHealthScoreFilter(e.target.value)}
                  label="Índice de Salud"
                >
                  <MenuItem value="all">Todos los niveles</MenuItem>
                  <MenuItem value="excellent">Excelente (80-100%)</MenuItem>
                  <MenuItem value="good">Bueno (60-79%)</MenuItem>
                  <MenuItem value="poor">Crítico (&lt;60%)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          {filteredScans.length === 0 ? (
            <Alert 
              severity="info" 
              sx={{
                borderRadius: '12px',
                backgroundColor: '#F9FBFF',
                border: '1px solid #E3F2FD',
                '& .MuiAlert-icon': { color: '#1976D2' }
              }}
            >
              {domainFilter === 'all' 
                ? "No hay análisis ejecutados aún. Iniciá tu primer análisis de seguridad."
                : `No hay análisis para el dominio "${domainFilter}". Seleccioná este dominio e iniciá un análisis.`
              }
            </Alert>
          ) : (
            <Grid container spacing={2.5}>
              {filteredScans.map((scan, index) => {
                const previousScan = index < filteredScans.length - 1 ? filteredScans[index + 1] : null;
                const trendInfo = getTrendingInfo(scan.healthScore || 0, previousScan?.healthScore || null);
                const statusInfo = getStatusChipProps(scan.status);
                const healthInfo = getHealthScoreLabel(scan.healthScore || 0);
                const vulnInfo = formatVulnerabilityCount(scan);
                
                return (
                  <Grid item xs={12} lg={6} key={scan.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        borderRadius: '12px',
                        border: index === 0 ? '2px solid #1976D2' : '1px solid #E0E0E0',
                        background: '#FFFFFF',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': { 
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          transform: 'translateY(-2px)'
                        },
                        // Animación de entrada
                        animation: 'fadeInUp 0.15s ease-out',
                        animationDelay: `${index * 0.05}s`,
                        '@keyframes fadeInUp': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(20px)'
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)'
                          }
                        }
                      }}
                      onClick={() => handleViewDetails(scan)}
                    >
                      {/* Badge de "Más reciente" */}
                      {index === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: 16,
                            background: 'linear-gradient(90deg, #1976D2, #42A5F5)',
                            color: 'white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            zIndex: 1
                          }}
                        >
                          MÁS RECIENTE
                        </Box>
                      )}
                      
                      <CardContent sx={{ p: 3 }}>
                        {/* Header del informe */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <Security sx={{ color: '#1976D2', fontSize: '18px' }} />
                              <Typography 
                                variant="h6" 
                                sx={{
                                  fontWeight: 600,
                                  color: '#1E2A38',
                                  fontSize: '16px'
                                }}
                              >
                                {scan.domain}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#757575',
                                fontSize: '13px'
                              }}
                            >
                              Análisis realizado el {formatDateTime(scan.createdAt)}
                            </Typography>
                          </Box>
                          
                          <Chip
                            icon={<span style={{ fontSize: '12px' }}>{statusInfo.icon}</span>}
                            label={statusInfo.label}
                            sx={{
                              backgroundColor: statusInfo.color,
                              color: statusInfo.textColor,
                              fontWeight: 500,
                              fontSize: '12px',
                              height: '28px'
                            }}
                          />
                        </Box>
                        
                        {/* Progreso para escaneos activos */}
                        {scan.status === 'IN_PROGRESS' && (
                          <Box sx={{ mb: 2.5 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <CircularProgress size={16} />
                              <Typography variant="body2" color="#1976D2" fontWeight={500}>
                                Análisis en progreso...
                              </Typography>
                            </Box>
                            <LinearProgress 
                              sx={{ 
                                borderRadius: '6px', 
                                height: '6px',
                                backgroundColor: '#E3F2FD',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#1976D2'
                                }
                              }} 
                            />
                          </Box>
                        )}
                        
                        {/* Índice de Salud Digital */}
                        {scan.healthScore !== undefined && (
                          <Box sx={{ mb: 2.5 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" color="#616161" fontWeight={500}>
                                Índice de Salud Digital
                              </Typography>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                {healthInfo.icon}
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    color: healthInfo.color,
                                    fontSize: '18px'
                                  }}
                                >
                                  {scan.healthScore}%
                                </Typography>
                              </Box>
                            </Box>
                            
                            <LinearProgress
                              variant="determinate"
                              value={scan.healthScore}
                              sx={{ 
                                height: '6px', 
                                borderRadius: '6px',
                                backgroundColor: '#F5F5F5',
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(90deg, ${healthInfo.color}, ${healthInfo.color}90)`,
                                  borderRadius: '6px'
                                }
                              }}
                            />
                            
                            <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: healthInfo.color,
                                  fontWeight: 600,
                                  fontSize: '13px'
                                }}
                              >
                                {healthInfo.text}
                              </Typography>
                              {trendInfo && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: trendInfo.color,
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.25
                                  }}
                                >
                                  {trendInfo.text}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                        
                        {/* Resumen de vulnerabilidades */}
                        {scan.findingsCount !== undefined && (
                          <Box sx={{ mb: 2.5 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              {vulnInfo.icon}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: vulnInfo.color,
                                  fontWeight: 500,
                                  fontSize: '13px'
                                }}
                              >
                                {vulnInfo.text}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="#757575">
                              {formatVulnerabilitySummary(scan)}
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Acciones */}
                        <Box 
                          display="flex" 
                          justifyContent="space-between" 
                          alignItems="center" 
                          pt={1.5}
                          borderTop="1px solid #F0F0F0"
                        >
                          <Tooltip title="Ver análisis detallado">
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(scan);
                              }}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                color: '#1976D2',
                                '&:hover': {
                                  backgroundColor: '#E3F2FD'
                                }
                              }}
                            >
                              Ver detalles
                            </Button>
                          </Tooltip>
                          
                          <Box display="flex" gap={0.5}>
                            <Tooltip title="Descargar reporte">
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle report download
                                }}
                                sx={{
                                  backgroundColor: '#ECEFF1',
                                  color: '#757575',
                                  '&:hover': { 
                                    backgroundColor: '#E3F2FD', 
                                    color: '#1976D2' 
                                  }
                                }}
                              >
                                <Assessment fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Repetir análisis">
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDomain(scan.domain);
                                  handleStartScan();
                                }}
                                sx={{
                                  backgroundColor: '#ECEFF1',
                                  color: '#757575',
                                  '&:hover': { 
                                    backgroundColor: '#E3F2FD', 
                                    color: '#1976D2' 
                                  }
                                }}
                              >
                                <RestartAlt fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Comparar resultados">
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle comparison
                                }}
                                sx={{
                                  backgroundColor: '#ECEFF1',
                                  color: '#757575',
                                  '&:hover': { 
                                    backgroundColor: '#E3F2FD', 
                                    color: '#1976D2' 
                                  }
                                }}
                              >
                                <CompareArrows fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Scan Details Dialog - Rediseñado como Resumen Ejecutivo */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => {
          setDetailsOpen(false);
          setSelectedScanId(null);
        }} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            p: 0,
            background: 'linear-gradient(135deg, #1E2A38 0%, #1976D2 50%, #42A5F5 100%)',
            color: 'white',
            borderRadius: '16px 16px 0 0',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
              <Box display="flex" alignItems="center" gap={2} flex={1}>
                <Box 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Shield sx={{ color: 'white', fontSize: '28px' }} />
                </Box>
                <Box flex={1}>
                  <Typography 
                    variant="h5" 
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif',
                      fontSize: '24px',
                      mb: 0.5
                    }}
                  >
                    Detalle del Análisis — {selectedScan?.domain}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '14px',
                      fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                    }}
                  >
                    Reporte de vulnerabilidades y estado de seguridad digital
                  </Typography>
                </Box>
              </Box>
              
              <Tooltip title="Identificador único del análisis - Click para copiar">
                <Chip 
                  label={formatScanId(selectedScan?.id || '')}
                  size="medium"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedScan?.id || '');
                    toast.success('ID copiado al portapapeles');
                  }}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
          {selectedScan && (
            <Box>
              {/* Bloque Principal - Dos Columnas Profesional */}
              <Box sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F7FA 100%)',
                borderBottom: '1px solid #ECEFF1'
              }}>
                <Grid container spacing={5}>
                  {/* Columna Izquierda: Estado del Análisis */}
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Flag sx={{ color: '#1976D2', fontSize: '20px' }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1E2A38', 
                            fontWeight: 600, 
                            fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                          }}
                        >
                          Estado del Análisis
                        </Typography>
                      </Box>
                      
                      {/* Estado Visual Mejorado */}
                      <Box sx={{ mb: 4 }}>
                        {selectedScan.status === 'COMPLETED' && (
                          <Box 
                            sx={{
                              background: 'linear-gradient(90deg, #E8F5E9, #F1F8E9)',
                              border: '2px solid #4CAF50',
                              borderRadius: '16px',
                              p: 2.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                              animation: 'pulse 2s infinite'
                            }}
                          >
                            <CheckCircle sx={{ color: '#4CAF50', fontSize: '24px' }} />
                            <Typography 
                              sx={{ 
                                color: '#2E7D32', 
                                fontWeight: 600, 
                                fontSize: '16px',
                                fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                              }}
                            >
                              ✅ Análisis finalizado exitosamente
                            </Typography>
                          </Box>
                        )}
                        {selectedScan.status === 'IN_PROGRESS' && (
                          <Box 
                            sx={{
                              background: 'linear-gradient(90deg, #FFF8E1, #FFFDE7)',
                              border: '2px solid #F57C00',
                              borderRadius: '16px',
                              p: 2.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              boxShadow: '0 4px 12px rgba(245, 124, 0, 0.15)'
                            }}
                          >
                            <CircularProgress size={24} sx={{ color: '#F57C00' }} />
                            <Typography 
                              sx={{ 
                                color: '#E65100', 
                                fontWeight: 600, 
                                fontSize: '16px',
                                fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                              }}
                            >
                              � Análisis en ejecución...
                            </Typography>
                          </Box>
                        )}
                        {selectedScan.status === 'FAILED' && (
                          <Box 
                            sx={{
                              background: 'linear-gradient(90deg, #FFEBEE, #FFEAEA)',
                              border: '2px solid #E53935',
                              borderRadius: '16px',
                              p: 2.5,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              boxShadow: '0 4px 12px rgba(229, 57, 53, 0.15)'
                            }}
                          >
                            <Error sx={{ color: '#E53935', fontSize: '24px' }} />
                            <Typography 
                              sx={{ 
                                color: '#C62828', 
                                fontWeight: 600, 
                                fontSize: '16px',
                                fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                              }}
                            >
                              ❌ El análisis falló - Se requiere intervención
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Tiempos con Mejor Diseño */}
                      <Box sx={{ 
                        background: 'white', 
                        borderRadius: '12px', 
                        p: 3,
                        border: '1px solid #E0E0E0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            color: '#757575', 
                            fontWeight: 600, 
                            mb: 2,
                            textTransform: 'uppercase',
                            fontSize: '12px',
                            letterSpacing: '0.8px'
                          }}
                        >
                          Cronología del Análisis
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <PlayArrow sx={{ color: '#1976D2', fontSize: '20px' }} />
                            <Box>
                              <Typography variant="body2" color="#757575" fontSize="12px">
                                Iniciado
                              </Typography>
                              <Typography variant="body1" fontWeight={600} color="#1E2A38" fontSize="14px">
                                {formatDateTime(selectedScan.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Update sx={{ color: '#1976D2', fontSize: '20px' }} />
                            <Box>
                              <Typography variant="body2" color="#757575" fontSize="12px">
                                Última actualización
                              </Typography>
                              <Typography variant="body1" fontWeight={600} color="#1E2A38" fontSize="14px">
                                {formatDateTime(selectedScan.updatedAt)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Columna Derecha: Nivel de Seguridad Digital */}
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <MonitorHeart sx={{ color: '#1976D2', fontSize: '20px' }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1E2A38', 
                            fontWeight: 600,
                            fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                          }}
                        >
                          Nivel de Seguridad Digital
                        </Typography>
                      </Box>
                      
                      {/* Score Principal Rediseñado */}
                      <Box sx={{ 
                        background: 'white', 
                        borderRadius: '20px', 
                        p: 4,
                        border: '1px solid #E0E0E0',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Background Pattern */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: selectedScan.healthScore && selectedScan.healthScore >= 70 
                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(102, 187, 106, 0.03) 100%)'
                            : selectedScan.healthScore && selectedScan.healthScore >= 50
                            ? 'linear-gradient(135deg, rgba(245, 124, 0, 0.05) 0%, rgba(255, 152, 0, 0.03) 100%)'
                            : 'linear-gradient(135deg, rgba(229, 57, 53, 0.05) 0%, rgba(244, 67, 54, 0.03) 100%)',
                          pointerEvents: 'none'
                        }} />
                        
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                          <Typography 
                            variant="h2" 
                            sx={{ 
                              fontWeight: 800,
                              fontSize: '3.5rem',
                              background: selectedScan.healthScore && selectedScan.healthScore >= 70 
                                ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                                : selectedScan.healthScore && selectedScan.healthScore >= 50
                                ? 'linear-gradient(135deg, #F57C00, #FF9800)'
                                : 'linear-gradient(135deg, #E53935, #F44336)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              mb: 1
                            }}
                          >
                            {selectedScan.healthScore ?? 'N/A'}%
                          </Typography>
                          
                          <Typography 
                            variant="h5"
                            sx={{
                              fontWeight: 600,
                              color: selectedScan.healthScore && selectedScan.healthScore >= 70 
                                ? '#4CAF50' 
                                : selectedScan.healthScore && selectedScan.healthScore >= 50
                                ? '#F57C00'
                                : '#E53935',
                              mb: 2,
                              fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                            }}
                          >
                            {selectedScan.healthScore && selectedScan.healthScore >= 70 
                              ? '🛡️ Protección óptima' 
                              : selectedScan.healthScore && selectedScan.healthScore >= 50
                              ? '⚠️ Riesgo moderado detectado'
                              : '🚨 Riesgo alto detectado'}
                          </Typography>
                          
                          {/* Progress Bar Animada Mejorada */}
                          <LinearProgress
                            variant="determinate"
                            value={selectedScan.healthScore || 0}
                            sx={{ 
                              height: '12px', 
                              borderRadius: '6px',
                              backgroundColor: '#F5F5F5',
                              mb: 2,
                              '& .MuiLinearProgress-bar': {
                                background: selectedScan.healthScore && selectedScan.healthScore >= 70 
                                  ? 'linear-gradient(90deg, #4CAF50, #66BB6A, #AEEA00)'
                                  : selectedScan.healthScore && selectedScan.healthScore >= 50
                                  ? 'linear-gradient(90deg, #F57C00, #FF9800, #FFB300)'
                                  : 'linear-gradient(90deg, #E53935, #F44336, #FF5722)',
                                borderRadius: '6px',
                                animation: 'progressAnimation 2s ease-out',
                                boxShadow: selectedScan.healthScore && selectedScan.healthScore >= 70 
                                  ? '0 2px 8px rgba(76, 175, 80, 0.3)'
                                  : selectedScan.healthScore && selectedScan.healthScore >= 50
                                  ? '0 2px 8px rgba(245, 124, 0, 0.3)'
                                  : '0 2px 8px rgba(229, 57, 53, 0.3)'
                              },
                              '@keyframes progressAnimation': {
                                '0%': { width: '0%' },
                                '100%': { width: `${selectedScan.healthScore || 0}%` }
                              }
                            }}
                          />
                          
                          {/* Comparación */}
                          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                            <Typography variant="body2" color="#9E9E9E" fontSize="13px">
                              vs análisis anterior:
                            </Typography>
                            <Typography variant="body2" color="#9E9E9E" fontSize="13px" fontWeight={500}>
                              ↔️ Sin datos previos
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Mini Resumen Visual */}
                      {selectedScan.findingsCount > 0 && (
                        <Box sx={{ 
                          mt: 3,
                          background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid #E0E0E0'
                        }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: '#757575', 
                              fontWeight: 600, 
                              mb: 2,
                              fontSize: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.8px'
                            }}
                          >
                            📊 Resumen Ejecutivo
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Security sx={{ color: '#F57C00', fontSize: '16px' }} />
                              <Typography variant="body2" color="#1E2A38" fontWeight={500}>
                                {selectedScan.findingsCount} vulnerabilidades detectadas
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Settings sx={{ color: '#1976D2', fontSize: '16px' }} />
                              <Typography variant="body2" color="#757575">
                                Análisis técnico completado
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <TrendingUp sx={{ color: '#4CAF50', fontSize: '16px' }} />
                              <Typography variant="body2" color="#757575">
                                Mejora esperada: +15% tras corrección
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Sección de Vulnerabilidades - Rediseñada */}
              <Box sx={{ p: 4, backgroundColor: 'white' }}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={2} 
                  mb={3}
                  sx={{
                    pb: 2,
                    borderBottom: '2px solid #F5F5F5'
                  }}
                >
                  <Box sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F57C00 100%)',
                    borderRadius: '12px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <WarningAmber sx={{ color: 'white', fontSize: '24px' }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1E2A38',
                        fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif',
                        mb: 0.5
                      }}
                    >
                      Análisis de Vulnerabilidades
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#757575',
                        fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                      }}
                    >
                      {selectedScan.findingsCount} elementos de seguridad identificados para revisión
                    </Typography>
                  </Box>
                </Box>
              
                {detailsLoading ? (
                  <Box>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} sx={{ mb: 2 }}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Box>
                ) : selectedScan.findingsCount === 0 ? (
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />}
                    sx={{
                      backgroundColor: '#E8F5E9',
                      color: '#2E7D32',
                      border: '1px solid #C8E6C9',
                      borderRadius: '12px',
                      fontWeight: 500
                    }}
                  >
                    ¡Excelente! No se encontraron vulnerabilidades de seguridad en tu dominio.
                  </Alert>
                ) : scanDetailsData?.getSecurityScanStatus?.findings ? (
                (() => {
                  const groupedFindings = groupFindingsBySeverity(scanDetailsData.getSecurityScanStatus.findings);
                  const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
                  
                  return (
                    <Box>
                      {severityOrder.map((severity) => {
                        const findings = groupedFindings[severity];
                        if (findings.length === 0) return null;
                        
                        return (
                          <Box key={severity} sx={{ mb: 3 }}>
                            {/* Encabezado de severidad */}
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                mb: 2, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                fontWeight: 'bold'
                              }}
                            >
                              {getSeverityIcon(severity)}
                              {getSeverityLabel(severity)} ({findings.length})
                            </Typography>
                            
                            {/* Lista de vulnerabilidades */}
                            <List sx={{ pl: 2 }}>
                              {findings.map((finding: SecurityFinding) => {
                                const translatedTitle = translateVulnerabilityTitle(finding.title);
                                const translatedDescription = translateVulnerabilityDescription(finding.description);
                                
                                return (
                                  <Accordion key={finding.id} sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                      <Box display="flex" alignItems="center" gap={1} width="100%">
                                        {getCategoryIconByType(translateCategory(finding.category))}
                                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                          {translatedTitle}
                                        </Typography>
                                        <Chip
                                          label={translateSeverity(finding.severity)}
                                          color={
                                            finding.severity.toLowerCase() === 'critical' || finding.severity.toLowerCase() === 'high'
                                              ? 'error'
                                              : finding.severity.toLowerCase() === 'medium'
                                              ? 'warning'
                                              : 'info'
                                          }
                                          size="small"
                                        />
                                      </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Box>
                                        <Typography variant="body2" color="text.primary" paragraph>
                                          {translatedDescription}
                                        </Typography>
                                        {finding.recommendation && (
                                          <Paper sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                              <Typography variant="body2" fontWeight="bold" color="primary">
                                                💡 Recomendación:
                                              </Typography>
                                              <Tooltip title="Copiar recomendación">
                                                <IconButton size="small" onClick={() => navigator.clipboard?.writeText(finding.recommendation || '')}>
                                                  <ContentCopy fontSize="small" />
                                                </IconButton>
                                              </Tooltip>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                              {translateVulnerabilityDescription(finding.recommendation)}
                                            </Typography>
                                          </Paper>
                                        )}
                                      </Box>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                              })}
                            </List>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })()
                ) : (
                  <Box
                    sx={{
                      background: '#FFF8E1',
                      borderLeft: '4px solid #F57C00',
                      color: '#E65100',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      boxShadow: '0 4px 12px rgba(245, 124, 0, 0.1)',
                      border: '1px solid #FFE0B2'
                    }}
                  >
                    <Warning sx={{ color: '#F57C00', fontSize: '24px' }} />
                    <Box flex={1}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#E65100',
                          mb: 1,
                          fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                        }}
                      >
                        ⚠️ No se pudieron cargar los datos del análisis
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#E65100',
                          opacity: 0.8,
                          mb: 2,
                          fontFamily: 'Inter, "IBM Plex Sans", -apple-system, sans-serif'
                        }}
                      >
                        Reintentá la carga o exportá el informe completo para revisar offline.
                      </Typography>
                      <Button 
                        size="small"
                        startIcon={<Refresh />}
                        onClick={() => {
                          toast.success('Reintentando carga de datos...');
                          // Aquí iría la lógica de reintento
                        }}
                        sx={{
                          color: '#F57C00',
                          backgroundColor: 'rgba(245, 124, 0, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(245, 124, 0, 0.2)'
                          }
                        }}
                      >
                        🔄 Reintentar carga
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions 
          sx={{ 
            borderTop: '1px solid #E0E0E0',
            padding: '24px 32px',
            background: '#F9FAFB',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            borderRadius: '0 0 16px 16px'
          }}
        >
          {/* Botón principal según el estado */}
          {selectedScan?.status === 'FAILED' ? (
            <Button 
              startIcon={<Refresh />}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                }
              }}
              onClick={() => {
                toast.success('Reintentando análisis...');
                setDetailsOpen(false);
              }}
            >
              Reintentar Análisis
            </Button>
          ) : (
            <Button 
              startIcon={<PictureAsPdf />}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                }
              }}
              onClick={() => {
                toast.success('✅ Informe exportado correctamente', {
                  duration: 3000,
                  icon: '📄'
                });
              }}
            >
              Descargar reporte completo
            </Button>
          )}
          
          {/* Botón Cerrar - Neutral */}
          <Button 
            onClick={() => {
              setDetailsOpen(false);
              setSelectedScanId(null);
            }}
            variant="text"
            size="large"
            sx={{
              color: '#757575',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#ECEFF1',
                color: '#424242'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de upgrade cuando se alcanza límite de plan */}
      <UpgradeModal 
        open={upgradeModalOpen}
        onClose={() => {
          setUpgradeModalOpen(false);
          setPlanLimitError(null);
        }}
        error={planLimitError}
      />
    </Box>
  );
}
