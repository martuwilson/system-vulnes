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
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
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
      if (domainFilter !== 'ALL' && (finding.asset?.domain || 'Sin dominio') !== domainFilter) return false;
      return true;
    });
  }, [findings, severityFilter, statusFilter, categoryFilter, domainFilter]);

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
      case 'MEDIUM': return 'warning';
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
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ fontSize: '1.2rem' }}>📊</Box>
                <Typography variant="h6" color="primary.main">Total</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ fontSize: '1.2rem' }}>🔴</Box>
                <Typography variant="h6" color="error.main">Críticas</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">{stats.critical}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ fontSize: '1.2rem' }}>🟠</Box>
                <Typography variant="h6" color="warning.main">Altas</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">{stats.high}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ fontSize: '1.2rem' }}>🔵</Box>
                <Typography variant="h6" color="info.main">Medias</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="info.main">{stats.medium}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box sx={{ fontSize: '1.2rem' }}>🟢</Box>
                <Typography variant="h6" color="success.main">Resueltas</Typography>
              </Box>
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
              {domainStats.map((domainStat) => {
                const healthScore = domainStat.total > 0 
                  ? Math.round(((domainStat.resolved / domainStat.total) * 100))
                  : 100;
                
                const getHealthColor = (score: number) => {
                  if (score >= 80) return 'success.main';
                  if (score >= 60) return 'warning.main';
                  return 'error.main';
                };

                const getHealthEmoji = (score: number) => {
                  if (score >= 80) return '🟢';
                  if (score >= 60) return '🟡';
                  return '🔴';
                };

                return (
                  <Grid item xs={12} sm={6} md={4} key={domainStat.domain}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-2px)',
                          bgcolor: 'action.hover'
                        },
                        border: domainFilter === domainStat.domain ? 2 : 1,
                        borderColor: domainFilter === domainStat.domain ? 'primary.main' : 'divider'
                      }}
                      onClick={() => setDomainFilter(domainFilter === domainStat.domain ? 'ALL' : domainStat.domain)}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            🌐 {domainStat.domain}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              {getHealthEmoji(healthScore)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={getHealthColor(healthScore)}
                              fontWeight="bold"
                            >
                              {healthScore}%
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="h5" color="primary.main" sx={{ mb: 1 }}>
                          {domainStat.total} vulnerabilidades
                        </Typography>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                          {domainStat.critical > 0 && (
                            <Chip
                              size="small"
                              label={`🔴 ${domainStat.critical}`}
                              color="error"
                              variant="outlined"
                            />
                          )}
                          {domainStat.high > 0 && (
                            <Chip
                              size="small"
                              label={`🟠 ${domainStat.high}`}
                              color="warning"
                              variant="outlined"
                            />
                          )}
                          {domainStat.medium > 0 && (
                            <Chip
                              size="small"
                              label={`🔵 ${domainStat.medium}`}
                              color="info"
                              variant="outlined"
                            />
                          )}
                          {domainStat.resolved > 0 && (
                            <Chip
                              size="small"
                              label={`✅ ${domainStat.resolved}`}
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Dominio</InputLabel>
                <Select
                  value={domainFilter}
                  label="Dominio"
                  onChange={(e: SelectChangeEvent) => setDomainFilter(e.target.value)}
                >
                  <MenuItem value="ALL">🌐 Todos los dominios</MenuItem>
                  {domainStats.map((domain) => (
                    <MenuItem key={domain.domain} value={domain.domain}>
                      🌐 {domain.domain} ({domain.total})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de Vulnerabilidades */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                📋 Vulnerabilidades encontradas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mostrando {filteredFindings.length} de {findings.length} vulnerabilidades
                {domainFilter !== 'ALL' && ` • Filtrado por: ${domainFilter}`}
                {severityFilter !== 'ALL' && ` • Severidad: ${severityFilter}`}
                {statusFilter !== 'ALL' && ` • Estado: ${statusFilter}`}
                {categoryFilter !== 'ALL' && ` • Categoría: ${categoryFilter}`}
              </Typography>
            </Box>
            {filteredFindings.length > 0 && (
              <Box display="flex" gap={1}>
                <Chip 
                  label={`🔴 ${filteredFindings.filter(f => f.severity === 'CRITICAL').length}`} 
                  size="small" 
                  color="error" 
                  variant="outlined" 
                />
                <Chip 
                  label={`🟠 ${filteredFindings.filter(f => f.severity === 'HIGH').length}`} 
                  size="small" 
                  color="warning" 
                  variant="outlined" 
                />
                <Chip 
                  label={`✅ ${filteredFindings.filter(f => f.status === 'RESOLVED').length}`} 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            )}
          </Box>
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
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalles">
                          <Chip
                            size="small"
                            label="Ver"
                            variant="outlined"
                            icon={<Visibility />}
                            onClick={() => handleViewDetails(finding)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                        {finding.status === 'OPEN' && (
                          <Tooltip title="Marcar como resuelta">
                            <Chip
                              size="small"
                              label="Resolver"
                              color="success"
                              variant="outlined"
                              icon={<CheckCircle />}
                              onClick={() => handleStatusChange(finding.id, 'RESOLVED')}
                              sx={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        )}
                        {finding.status === 'RESOLVED' && (
                          <Tooltip title="Reabrir vulnerabilidad">
                            <Chip
                              size="small"
                              label="Reabrir"
                              color="error"
                              variant="outlined"
                              onClick={() => handleStatusChange(finding.id, 'OPEN')}
                              sx={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        )}
                        {finding.status !== 'IGNORED' && finding.status !== 'RESOLVED' && (
                          <Tooltip title="Ignorar vulnerabilidad">
                            <Chip
                              size="small"
                              label="Ignorar"
                              color="error"
                              variant="outlined"
                              icon={<Cancel />}
                              onClick={() => handleStatusChange(finding.id, 'IGNORED')}
                              sx={{ cursor: 'pointer' }}
                            />
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
          <Box display="flex" alignItems="center" gap={2}>
            <ErrorIcon color="error" />
            <Typography variant="h6" fontWeight="600">Detalles de Vulnerabilidad</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFinding && (
            <Box>
              <Stack spacing={3}>
                {/* Título destacado con ícono de severidad */}
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    {getSeverityIcon(selectedFinding.severity)}
                    <Typography variant="h5" fontWeight="700" color="text.primary">
                      {translateVulnerabilityTitle(selectedFinding.title)}
                    </Typography>
                  </Box>
                </Box>

                {/* Impacto */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Warning color="error" />
                    <Typography variant="h6" color="error.main" gutterBottom={false} fontWeight="600">
                      Impacto de Seguridad
                    </Typography>
                  </Box>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      bgcolor: '#FFEAEA', 
                      borderLeft: 4, 
                      borderLeftColor: 'error.main',
                      border: '1px solid #FFCDD2'
                    }}
                  >
                    <Typography variant="body1" lineHeight={1.6} color="text.primary">
                      {translateVulnerabilityDescription(selectedFinding.description)}
                    </Typography>
                  </Paper>
                </Box>

                {/* Recomendación */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <BugReport color="primary" />
                    <Typography variant="h6" color="primary.main" gutterBottom={false} fontWeight="600">
                      Acción Recomendada
                    </Typography>
                  </Box>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      bgcolor: '#E8F3FF', 
                      borderLeft: 4, 
                      borderLeftColor: 'primary.main',
                      border: '1px solid #BBDEFB'
                    }}
                  >
                    <Typography variant="body1" lineHeight={1.6} color="text.primary">
                      {selectedFinding.recommendation}
                    </Typography>
                  </Paper>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Información técnica */}
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="600" color="text.primary">
                    Información Técnica
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="500">
                        Nivel de Severidad
                      </Typography>
                      <Chip
                        icon={getSeverityIcon(selectedFinding.severity)}
                        label={translateSeverity(selectedFinding.severity)}
                        color={getSeverityColor(selectedFinding.severity) as any}
                        size="medium"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="500">
                        Estado de Resolución
                      </Typography>
                      <Chip
                        label={translateStatus(selectedFinding.status)}
                        color={getStatusColor(selectedFinding.status) as any}
                        size="medium"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="500">
                        Categoría de Vulnerabilidad
                      </Typography>
                      <Typography variant="body1" fontWeight="500">{translateCategory(selectedFinding.category)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="500">
                        Activo Afectado
                      </Typography>
                      <Typography variant="body1" color="primary" fontWeight="600">
                        {selectedFinding.asset.domain}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
            {/* Navegación y botón cerrar */}
            <Box display="flex" alignItems="center" gap={3}>
              {/* Botón Cerrar - Acción secundaria separada */}
              <Button 
                onClick={() => setDetailsOpen(false)}
                color="inherit"
                variant="outlined"
                sx={{ color: 'text.secondary' }}
              >
                Cerrar
              </Button>

              {/* Navegación entre vulnerabilidades */}
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  Mostrando {filteredFindings.findIndex(f => f.id === selectedFinding?.id) + 1}/{filteredFindings.length}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={filteredFindings.findIndex(f => f.id === selectedFinding?.id) === 0}
                    onClick={() => {
                      const currentIndex = filteredFindings.findIndex(f => f.id === selectedFinding?.id);
                      if (currentIndex > 0) {
                        setSelectedFinding(filteredFindings[currentIndex - 1]);
                      }
                    }}
                    sx={{ minWidth: 40 }}
                  >
                    ‹
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={filteredFindings.findIndex(f => f.id === selectedFinding?.id) === filteredFindings.length - 1}
                    onClick={() => {
                      const currentIndex = filteredFindings.findIndex(f => f.id === selectedFinding?.id);
                      if (currentIndex < filteredFindings.length - 1) {
                        setSelectedFinding(filteredFindings[currentIndex + 1]);
                      }
                    }}
                    sx={{ minWidth: 40 }}
                  >
                    ›
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Acciones principales agrupadas */}
            <Box display="flex" gap={2}>
              {/* Botón de exportar */}
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Visibility />}
                onClick={() => {
                  const exportText = `
REPORTE DE VULNERABILIDAD
========================

VULNERABILIDAD: ${translateVulnerabilityTitle(selectedFinding?.title || '')}
SEVERIDAD: ${translateSeverity(selectedFinding?.severity || '')}
ESTADO: ${translateStatus(selectedFinding?.status || '')}
ACTIVO: ${selectedFinding?.asset.domain}
CATEGORÍA: ${translateCategory(selectedFinding?.category || '')}

IMPACTO DE SEGURIDAD:
${translateVulnerabilityDescription(selectedFinding?.description || '')}

ACCIÓN RECOMENDADA:
${selectedFinding?.recommendation}
                  `.trim();
                  
                  navigator.clipboard.writeText(exportText);
                  // TODO: Mostrar toast de confirmación
                }}
                title="Exportar reporte"
              >
                Exportar
              </Button>

              {/* Acciones según estado */}
              {selectedFinding?.status === 'OPEN' && (
                <>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<Info />}
                    onClick={() => {
                      handleStatusChange(selectedFinding.id, 'IN_PROGRESS');
                    }}
                  >
                    En Progreso
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => {
                      handleStatusChange(selectedFinding.id, 'RESOLVED');
                    }}
                  >
                    Resolver Vulnerabilidad
                  </Button>
                </>
              )}
              
              {selectedFinding?.status === 'IN_PROGRESS' && (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    handleStatusChange(selectedFinding.id, 'RESOLVED');
                  }}
                >
                  Resolver Vulnerabilidad
                </Button>
              )}
              
              {selectedFinding?.status === 'RESOLVED' && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => {
                    handleStatusChange(selectedFinding.id, 'OPEN');
                  }}
                >
                  Reabrir Vulnerabilidad
                </Button>
              )}
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
