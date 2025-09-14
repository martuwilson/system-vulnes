import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  FilterList,
  Visibility,
  CheckCircle,
  Cancel,
  Warning,
  Error as ErrorIcon,
  Info,
  BugReport,
  Language
} from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../../hooks/useAuth';
import { translateVulnerabilityTitle, translateVulnerabilityDescription } from '../../lib/translations';

// GraphQL Queries
const GET_USER_COMPANY = gql`
  query GetUserCompany {
    myCompanies {
      id
      name
      domain
    }
  }
`;

const GET_ALL_FINDINGS = gql`
  query GetAllFindings($companyId: String!) {
    getAllFindings(companyId: $companyId) {
      id
      category
      severity
      title
      description
      recommendation
      status
      assetId
      asset {
        domain
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_FINDING_STATUS = gql`
  mutation UpdateFindingStatusDetailed($findingId: String!, $status: String!) {
    updateFindingStatusDetailed(findingId: $findingId, status: $status) {
      id
      category
      severity
      title
      description
      recommendation
      status
      assetId
      asset {
        domain
      }
      createdAt
      updatedAt
    }
  }
`;

// Types
interface Finding {
  id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED';
  assetId: string;
  asset: {
    domain: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: string;
  name: string;
  domain: string;
}

export function FindingsPage() {
  const { isAuthenticated } = useAuth();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Obtener la empresa del usuario
  const { data: companyData } = useQuery(GET_USER_COMPANY, {
    skip: !isAuthenticated,
    errorPolicy: 'all'
  });
  
  const userCompany: Company | undefined = companyData?.myCompanies?.[0];

  const { data, loading, error, refetch } = useQuery(GET_ALL_FINDINGS, {
    variables: { companyId: userCompany?.id },
    skip: !userCompany?.id,
    errorPolicy: 'all'
  });

  const [updateFindingStatus] = useMutation(UPDATE_FINDING_STATUS, {
    onCompleted: () => {
      refetch();
    }
  });

  const findings: Finding[] = data?.getAllFindings || [];

  // Filtros
  const filteredFindings = useMemo(() => {
    return findings.filter(finding => {
      if (severityFilter !== 'ALL' && finding.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && finding.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && finding.category !== categoryFilter) return false;
      return true;
    });
  }, [findings, severityFilter, statusFilter, categoryFilter]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = findings.length;
    const critical = findings.filter(f => f.severity === 'CRITICAL').length;
    const high = findings.filter(f => f.severity === 'HIGH').length;
    const medium = findings.filter(f => f.severity === 'MEDIUM').length;
    const low = findings.filter(f => f.severity === 'LOW').length;
    const open = findings.filter(f => f.status === 'OPEN').length;
    const resolved = findings.filter(f => f.status === 'RESOLVED').length;

    return { total, critical, high, medium, low, open, resolved };
  }, [findings]);

  // Estadísticas por dominio
  const domainStats = useMemo(() => {
    const domains = new Map<string, { total: number; critical: number; high: number; medium: number; low: number; open: number; resolved: number }>();
    
    findings.forEach(finding => {
      const domain = finding.asset?.domain || 'Sin dominio';
      if (!domains.has(domain)) {
        domains.set(domain, { total: 0, critical: 0, high: 0, medium: 0, low: 0, open: 0, resolved: 0 });
      }
      
      const stats = domains.get(domain)!;
      stats.total++;
      
      // Contadores por severidad
      switch (finding.severity) {
        case 'CRITICAL': stats.critical++; break;
        case 'HIGH': stats.high++; break;
        case 'MEDIUM': stats.medium++; break;
        case 'LOW': stats.low++; break;
      }
      
      // Contadores por estado
      switch (finding.status) {
        case 'OPEN': stats.open++; break;
        case 'RESOLVED': stats.resolved++; break;
      }
    });
    
    return Array.from(domains.entries()).map(([domain, stats]) => ({ domain, ...stats }));
  }, [findings]);

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ErrorIcon />;
      case 'HIGH': return <Warning />;
      case 'MEDIUM': return <Info />;
      case 'LOW': return <BugReport />;
      default: return <Info />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'error';
      case 'IN_PROGRESS': return 'warning';
      case 'RESOLVED': return 'success';
      case 'IGNORED': return 'default';
      default: return 'default';
    }
  };

  const translateSeverity = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'Crítica';
      case 'HIGH': return 'Alta';
      case 'MEDIUM': return 'Media';
      case 'LOW': return 'Baja';
      default: return severity;
    }
  };

  const translateCategory = (category: string) => {
    switch (category) {
      case 'EMAIL_SECURITY': return 'Seguridad de Email';
      case 'SSL_CERTIFICATE': return 'Certificado SSL';
      case 'WEB_SECURITY': return 'Seguridad Web';
      case 'NETWORK_SECURITY': return 'Seguridad de Red';
      default: return category;
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Abierta';
      case 'IN_PROGRESS': return 'En Progreso';
      case 'RESOLVED': return 'Resuelta';
      case 'IGNORED': return 'Ignorada';
      default: return status;
    }
  };

  const handleStatusChange = async (findingId: string, newStatus: string) => {
    try {
      await updateFindingStatus({
        variables: { findingId, status: newStatus }
      });
    } catch (error) {
      console.error('Error updating finding status:', error);
    }
  };

  const handleViewDetails = (finding: Finding) => {
    setSelectedFinding(finding);
    setDetailsOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const csvData = filteredFindings.map(finding => ({
      'Severidad': translateSeverity(finding.severity),
      'Título': translateVulnerabilityTitle(finding.title),
      'Categoría': finding.category,
      'Dominio': finding.asset?.domain || 'Sin dominio',
      'Estado': finding.status,
      'Descripción': translateVulnerabilityDescription(finding.description),
      'Recomendación': finding.recommendation,
      'Fecha de Creación': formatDateTime(finding.createdAt),
      'Última Actualización': formatDateTime(finding.updatedAt)
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vulnerabilidades-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LinearProgress />;
  if (error) return <Alert severity="error">Error al cargar vulnerabilidades: {error.message}</Alert>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Vulnerabilidades
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona y analiza las vulnerabilidades de seguridad encontradas
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={exportToCSV}
          disabled={filteredFindings.length === 0}
          sx={{ minWidth: 140 }}
        >
          Exportar CSV
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total</Typography>
              <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">Críticas</Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">{stats.critical}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">Altas</Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">{stats.high}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">Resueltas</Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">{stats.resolved}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estadísticas por Dominio */}
      {domainStats.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Language />
              <Typography variant="h6">Vulnerabilidades por Dominio</Typography>
            </Box>
            <Grid container spacing={2}>
              {domainStats.map((domainStat) => (
                <Grid item xs={12} sm={6} md={4} key={domainStat.domain}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {domainStat.domain}
                      </Typography>
                      <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
                        {domainStat.total}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {domainStat.critical > 0 && (
                          <Chip
                            size="small"
                            label={`${domainStat.critical} Críticas`}
                            color="error"
                          />
                        )}
                        {domainStat.high > 0 && (
                          <Chip
                            size="small"
                            label={`${domainStat.high} Altas`}
                            color="warning"
                          />
                        )}
                        {domainStat.open > 0 && (
                          <Chip
                            size="small"
                            label={`${domainStat.open} Abiertas`}
                            color="info"
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterList />
            <Typography variant="h6">Filtros</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Severidad</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severidad"
                  onChange={(e: SelectChangeEvent) => setSeverityFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todas</MenuItem>
                  <MenuItem value="CRITICAL">Críticas</MenuItem>
                  <MenuItem value="HIGH">Altas</MenuItem>
                  <MenuItem value="MEDIUM">Medias</MenuItem>
                  <MenuItem value="LOW">Bajas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todos</MenuItem>
                  <MenuItem value="OPEN">Abiertas</MenuItem>
                  <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                  <MenuItem value="RESOLVED">Resueltas</MenuItem>
                  <MenuItem value="IGNORED">Ignoradas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Categoría"
                  onChange={(e: SelectChangeEvent) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todas</MenuItem>
                  <MenuItem value="EMAIL_SECURITY">Seguridad de Email</MenuItem>
                  <MenuItem value="SSL_CERTIFICATE">Certificado SSL</MenuItem>
                  <MenuItem value="WEB_SECURITY">Seguridad Web</MenuItem>
                  <MenuItem value="NETWORK_SECURITY">Seguridad de Red</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de Vulnerabilidades */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vulnerabilidades ({filteredFindings.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Severidad</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Dominio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFindings.map((finding) => (
                  <TableRow key={finding.id} hover>
                    <TableCell>
                      <Chip
                        icon={getSeverityIcon(finding.severity)}
                        label={translateSeverity(finding.severity)}
                        color={getSeverityColor(finding.severity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {translateVulnerabilityTitle(finding.title)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {translateCategory(finding.category)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="primary">
                        {finding.asset.domain}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={translateStatus(finding.status)}
                        color={getStatusColor(finding.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(finding.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(finding)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {finding.status === 'OPEN' && (
                          <Tooltip title="Marcar como resuelta">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStatusChange(finding.id, 'RESOLVED')}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        )}
                        {finding.status !== 'IGNORED' && (
                          <Tooltip title="Ignorar">
                            <IconButton
                              size="small"
                              color="default"
                              onClick={() => handleStatusChange(finding.id, 'IGNORED')}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredFindings.length === 0 && (
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <BugReport sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No se encontraron vulnerabilidades
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Con los filtros aplicados no hay vulnerabilidades para mostrar
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles de Vulnerabilidad
        </DialogTitle>
        <DialogContent>
          {selectedFinding && (
            <Box>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Título</Typography>
                  <Typography variant="body1">{translateVulnerabilityTitle(selectedFinding.title)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
                  <Typography variant="body1">{translateVulnerabilityDescription(selectedFinding.description)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Recomendación</Typography>
                  <Typography variant="body1">{selectedFinding.recommendation}</Typography>
                </Box>
                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Severidad</Typography>
                    <Chip
                      icon={getSeverityIcon(selectedFinding.severity)}
                      label={translateSeverity(selectedFinding.severity)}
                      color={getSeverityColor(selectedFinding.severity) as any}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
                    <Chip
                      label={translateStatus(selectedFinding.status)}
                      color={getStatusColor(selectedFinding.status) as any}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Categoría</Typography>
                    <Typography variant="body1">{translateCategory(selectedFinding.category)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Dominio</Typography>
                    <Typography variant="body1" color="primary">{selectedFinding.asset.domain}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Cerrar</Button>
          {selectedFinding?.status === 'OPEN' && (
            <>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  handleStatusChange(selectedFinding.id, 'IN_PROGRESS');
                  setDetailsOpen(false);
                }}
              >
                En Progreso
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleStatusChange(selectedFinding.id, 'RESOLVED');
                  setDetailsOpen(false);
                }}
              >
                Marcar como Resuelta
              </Button>
            </>
          )}
          {selectedFinding?.status === 'IN_PROGRESS' && (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleStatusChange(selectedFinding.id, 'RESOLVED');
                setDetailsOpen(false);
              }}
            >
              Marcar como Resuelta
            </Button>
          )}
          {selectedFinding?.status === 'RESOLVED' && (
            <Button
              variant="outlined"
              onClick={() => {
                handleStatusChange(selectedFinding.id, 'OPEN');
                setDetailsOpen(false);
              }}
            >
              Reabrir
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
