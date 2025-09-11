import { useState } from 'react';
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
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { 
  PlayArrow, 
  Security, 
  Refresh,
  CheckCircle,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { translateSeverity, translateStatus, getCategoryIconByType, formatDateTime } from '../../lib/translations';

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

interface SecurityFinding {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
}

interface SecurityScan {
  id: string;
  domain: string;
  status: string;
  healthScore?: number;
  createdAt: string;
  updatedAt: string;
  findings: SecurityFinding[];
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'error';
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'queued': return 'warning';
    case 'failed': return 'error';
    default: return 'default';
  }
};

export function ScansPage() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [scanningDomain, setScanningDomain] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<SecurityScan | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Obtener las empresas del usuario
  const { data: companiesData } = useQuery(GET_MY_COMPANIES);
  const userCompany = companiesData?.myCompanies?.[0]; // Usar la primera empresa

  const { data, loading, error, refetch } = useQuery(GET_COMPANY_ASSETS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    pollInterval: 5000, // Poll every 5 seconds for scan updates
  });

  const [startScanQueued] = useMutation(START_SCAN_QUEUED);

  const assets: Asset[] = data?.companyAssets || [];
  const scans: SecurityScan[] = []; // Por ahora vacío hasta implementar la query de scans

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
        toast.success(`Escaneo iniciado para ${selectedDomain}`);
        refetch(); // Refresh to show new scan
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
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Historial de Escaneos ({scans.length})
          </Typography>
          
          {scans.length === 0 ? (
            <Alert severity="info">
              No hay escaneos ejecutados aún. Inicia tu primer escaneo de seguridad.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {scans.map((scan) => (
                <Grid item xs={12} md={6} key={scan.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 2 }
                    }}
                    onClick={() => handleViewDetails(scan)}
                  >
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
                        <Chip
                          label={translateStatus(scan.status)}
                          color={getStatusColor(scan.status) as any}
                          size="small"
                        />
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
                            color={
                              scan.healthScore >= 80 
                                ? 'success' 
                                : scan.healthScore >= 60 
                                ? 'warning' 
                                : 'error'
                            }
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {scan.healthScore}%
                          </Typography>
                        </Box>
                      )}
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {scan.findings.length} vulnerabilidades
                        </Typography>
                        <Button size="small" variant="outlined">
                          Ver Detalles
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
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
                Vulnerabilidades Encontradas ({selectedScan.findings.length})
              </Typography>
              
              {selectedScan.findings.length === 0 ? (
                <Alert severity="success" icon={<CheckCircle />}>
                  ¡Excelente! No se encontraron vulnerabilidades de seguridad.
                </Alert>
              ) : (
                <List>
                  {selectedScan.findings.map((finding) => (
                    <ListItem key={finding.id} divider>
                      <ListItemIcon>
                        {getCategoryIconByType(finding.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle2">
                              {finding.title}
                            </Typography>
                            <Chip
                              label={translateSeverity(finding.severity)}
                              color={getSeverityColor(finding.severity) as any}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={finding.description}
                      />
                    </ListItem>
                  ))}
                </List>
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
