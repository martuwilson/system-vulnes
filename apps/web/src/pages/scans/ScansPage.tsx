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
  Divider,
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
  Schedule,
  ExpandMore,
  ContentCopy,
  FileDownload,
  Assignment,
  PersonAdd,
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
  Remove
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { 
  translateStatus, 
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
      success
      scanId
      message
      healthScore
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'queued': 
    case 'programado': return 'warning';
    case 'failed':
    case 'fallido': return 'error';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return <CheckCircle fontSize="small" />;
    case 'in_progress': return <CircularProgress size={16} />;
    case 'queued':
    case 'programado': return <Schedule fontSize="small" />;
    case 'failed':
    case 'fallido': return <Error fontSize="small" />;
    default: return null;
  }
};

const getHealthScoreColor = (score: number) => {
  if (score >= 71) return 'success';
  if (score >= 41) return 'warning';
  return 'error';
};

const getHealthScoreBadge = (score: number) => {
  if (score >= 71) return 'Bueno';
  if (score >= 41) return 'Moderado';
  return 'Crítico';
};

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

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
      toast.error(error.message || 'Hubo un problema técnico. Verificá tu conexión e intentá nuevamente.');
    } finally {
      setScanningDomain(null);
    }
  };

  const handleViewDetails = (scan: SecurityScan) => {
    setSelectedScan(scan);
    setSelectedScanId(scan.id);
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

      {/* Scan Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => {
          setDetailsOpen(false);
          setSelectedScanId(null);
        }} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Security color="primary" />
              <Typography variant="h6" component="div">
                Detalles del Escaneo - {selectedScan?.domain}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Escaneo iniciado: {formatFullDateTime(selectedScan?.createdAt || '')} - 
                Estado: {translateStatus(selectedScan?.status || '')} {getStatusIcon(selectedScan?.status || '')}
              </Typography>
              <Chip 
                label={formatScanId(selectedScan?.id || '')}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedScan && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                    {getStatusIcon(selectedScan.status)}
                    <Chip
                      label={translateStatus(selectedScan.status)}
                      color={getStatusColor(selectedScan.status) as any}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Health Score:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <LinearProgress
                      variant="determinate"
                      value={selectedScan.healthScore || 0}
                      color={getHealthScoreColor(selectedScan.healthScore || 0)}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {selectedScan.healthScore ?? 'N/A'}%
                    </Typography>
                    <Chip 
                      label={getHealthScoreBadge(selectedScan.healthScore || 0)}
                      color={getHealthScoreColor(selectedScan.healthScore || 0)}
                      size="small"
                    />
                  </Box>
                  {/* Trend TODO: necesitaríamos datos del escaneo anterior */}
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Respecto al escaneo anterior:
                    </Typography>
                    {/* {getTrendIcon(selectedScan.healthScore || 0, previousScan?.healthScore || null)} */}
                    <Typography variant="caption" color="text.secondary">
                      Sin datos previos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Iniciado:
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedScan.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Actualizado:
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedScan.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Vulnerabilidades Detectadas ({selectedScan.findingsCount})
              </Typography>
              
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
                <Alert severity="success" icon={<CheckCircle />}>
                  ¡Excelente! No se encontraron vulnerabilidades de seguridad.
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
                <Alert severity="info">
                  No se pudieron cargar los detalles de las vulnerabilidades.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Box display="flex" justifyContent="space-between" width="100%" flexWrap="wrap" gap={1}>
            {/* Acciones principales */}
            <Box display="flex" gap={1}>
              <Button 
                startIcon={<FileDownload />}
                variant="outlined"
                color="primary"
                onClick={() => {
                  // TODO: Implementar exportación
                  toast.success('Funcionalidad de exportación próximamente');
                }}
              >
                Exportar PDF
              </Button>
              
              <Button 
                startIcon={<Assignment />}
                variant="outlined"
                color="info"
                onClick={() => {
                  // TODO: Implementar marcar como resuelto
                  toast.success('Funcionalidad de seguimiento próximamente');
                }}
              >
                Marcar como Resuelto
              </Button>
              
              <Button 
                startIcon={<PersonAdd />}
                variant="outlined"
                color="secondary"
                onClick={() => {
                  // TODO: Implementar asignación
                  toast.success('Funcionalidad de asignación próximamente');
                }}
              >
                Asignar
              </Button>
            </Box>
            
            {/* Cerrar */}
            <Button 
              onClick={() => {
                setDetailsOpen(false);
                setSelectedScanId(null);
              }}
              variant="contained"
            >
              Cerrar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
