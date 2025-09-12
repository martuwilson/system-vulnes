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
} from '@mui/material';
import { 
  PlayArrow, 
  Security, 
  Refresh,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Download,
  Compare,
  Error,
  Schedule,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { translateStatus, formatDateTime } from '../../lib/translations';

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

const getTrendIcon = (currentScore: number, previousScore: number | null) => {
  if (previousScore === null) return null;
  if (currentScore > previousScore) return <TrendingUp color="success" fontSize="small" />;
  if (currentScore < previousScore) return <TrendingDown color="error" fontSize="small" />;
  return <TrendingFlat color="inherit" fontSize="small" />;
};

const formatVulnerabilitySummary = (scan: SecurityScan) => {
  const parts = [];
  if (scan.criticalFindings > 0) parts.push(`${scan.criticalFindings} críticas`);
  if (scan.highFindings > 0) parts.push(`${scan.highFindings} altas`);
  if (scan.mediumFindings > 0) parts.push(`${scan.mediumFindings} medias`);
  if (scan.lowFindings > 0) parts.push(`${scan.lowFindings} bajas`);
  return parts.length > 0 ? parts.join(' | ') : 'Sin vulnerabilidades';
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
  
  // Filtros para el historial
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthScoreFilter, setHealthScoreFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Obtener las empresas del usuario
  const { data: companiesData } = useQuery(GET_MY_COMPANIES);
  const userCompany = companiesData?.myCompanies?.[0]; // Usar la primera empresa

  const { data, loading, error, refetch } = useQuery(GET_COMPANY_ASSETS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    pollInterval: 5000, // Poll every 5 seconds for scan updates
  });

  const { data: scansData, loading: scansLoading, refetch: refetchScans } = useQuery(GET_SECURITY_SCANS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    pollInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  const [startScanQueued] = useMutation(START_SCAN_QUEUED);

  const assets: Asset[] = data?.companyAssets || [];
  const allScans: SecurityScan[] = scansData?.securityScans || [];
  
  // Aplicar filtros
  const filteredScans = allScans.filter(scan => {
    if (statusFilter !== 'all' && scan.status.toLowerCase() !== statusFilter) {
      return false;
    }
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
        
        // Feedback inmediato
        toast.success(`🚀 Escaneo iniciado para ${selectedDomain} - Monitoreando progreso...`, {
          duration: 4000,
        });
        
        // Establecer el ID del escaneo activo para seguimiento
        if (scanId) {
          setActiveScanId(scanId);
        }
        
        refetch(); // Refresh assets
        refetchScans(); // Refresh scans list
      } else {
        toast.error(result.data?.startSecurityScanQueued?.message || 'Error al iniciar escaneo');
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      toast.error(error.message || 'Error al iniciar escaneo');
    } finally {
      setScanningDomain(null);
    }
  };

  const handleViewDetails = (scan: SecurityScan) => {
    setSelectedScan(scan);
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Escaneos de Seguridad
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ejecuta y monitorea escaneos de seguridad en tiempo real
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => refetch()}
        >
          Actualizar
        </Button>
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

      {/* Start New Scan */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Iniciar Nuevo Escaneo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona un dominio y ejecuta un escaneo de seguridad completo en background
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Dominio</InputLabel>
                <Select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  label="Seleccionar Dominio"
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.domain}>
                      {asset.domain}
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
                startIcon={scanningDomain ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                onClick={handleStartScan}
                disabled={!selectedDomain || scanningDomain === selectedDomain}
              >
                {scanningDomain === selectedDomain ? 'Iniciando...' : 'Iniciar Escaneo'}
              </Button>
            </Grid>
          </Grid>

          {assets.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No tienes dominios registrados. Ve a la sección de Empresas para agregar assets.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Historial de escaneos de seguridad ({filteredScans.length})
            </Typography>
            
            <Box display="flex" gap={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="completed">Completado</MenuItem>
                  <MenuItem value="in_progress">En progreso</MenuItem>
                  <MenuItem value="queued">En cola</MenuItem>
                  <MenuItem value="failed">Fallido</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Health Score</InputLabel>
                <Select
                  value={healthScoreFilter}
                  onChange={(e) => setHealthScoreFilter(e.target.value)}
                  label="Health Score"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="excellent">Excelente (80-100%)</MenuItem>
                  <MenuItem value="good">Bueno (60-79%)</MenuItem>
                  <MenuItem value="poor">Pobre (&lt;60%)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          {filteredScans.length === 0 ? (
            <Alert severity="info">
              No hay escaneos ejecutados aún. Inicia tu primer escaneo de seguridad.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {filteredScans.map((scan, index) => {
                const previousScan = index < filteredScans.length - 1 ? filteredScans[index + 1] : null;
                const trendIcon = getTrendIcon(scan.healthScore || 0, previousScan?.healthScore || null);
                
                return (
                  <Grid item xs={12} md={6} key={scan.id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': { boxShadow: 2 },
                        border: index === 0 ? '2px solid' : '1px solid',
                        borderColor: index === 0 ? 'primary.main' : 'grey.300'
                      }}
                      onClick={() => handleViewDetails(scan)}
                    >
                      {index === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Más reciente
                        </Box>
                      )}
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {scan.domain}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateTime(scan.createdAt)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {getStatusIcon(scan.status)}
                            <Chip
                              label={translateStatus(scan.status)}
                              color={getStatusColor(scan.status) as any}
                              size="small"
                            />
                          </Box>
                        </Box>
                        
                        {scan.status === 'IN_PROGRESS' && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Escaneo en progreso...
                            </Typography>
                            <LinearProgress />
                          </Box>
                        )}
                        
                        {scan.healthScore !== undefined && (
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Typography variant="body2">Health Score:</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={scan.healthScore}
                              color={getHealthScoreColor(scan.healthScore)}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Typography variant="body2" fontWeight="bold">
                                {scan.healthScore}%
                              </Typography>
                              {trendIcon}
                            </Box>
                          </Box>
                        )}
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="body2" color="text.secondary">
                            {formatVulnerabilitySummary(scan)}
                          </Typography>
                        </Box>

                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Button size="small" variant="outlined" startIcon={<Security />}>
                            Ver Detalles
                          </Button>
                          <Button size="small" variant="text" startIcon={<Download />}>
                            Reporte
                          </Button>
                          <Button size="small" variant="text" startIcon={<Refresh />}>
                            Re-escanear
                          </Button>
                          {index > 0 && (
                            <Button size="small" variant="text" startIcon={<Compare />}>
                              Comparar
                            </Button>
                          )}
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
        onClose={() => setDetailsOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Security color="primary" />
            Detalles del Escaneo - {selectedScan?.domain}
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
                  <Chip
                    label={translateStatus(selectedScan.status)}
                    color={getStatusColor(selectedScan.status) as any}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Health Score:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedScan.healthScore ?? 'N/A'}%
                  </Typography>
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

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Resumen de Vulnerabilidades ({selectedScan.findingsCount})
              </Typography>
              
              {selectedScan.findingsCount === 0 ? (
                <Alert severity="success" icon={<CheckCircle />}>
                  ¡Excelente! No se encontraron vulnerabilidades de seguridad.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {selectedScan.criticalFindings > 0 && (
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          {selectedScan.criticalFindings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Críticas
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {selectedScan.highFindings > 0 && (
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          {selectedScan.highFindings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Altas
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {selectedScan.mediumFindings > 0 && (
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {selectedScan.mediumFindings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Medias
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {selectedScan.lowFindings > 0 && (
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          {selectedScan.lowFindings}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bajas
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
