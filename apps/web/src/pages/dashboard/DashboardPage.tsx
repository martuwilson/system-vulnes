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
} from '@mui/icons-material';
import { HealthScoreIndicator } from '../../components/ui/HealthScoreIndicator';
import { SeverityChip } from '../../components/ui/SeverityChip';
import { MetricCard } from '../../components/ui/MetricCard';
// import { LoadingState } from '../../components/ui/LoadingState';
import { Toast, useToast } from '../../components/ui/Toast';
import { METRIC_GRADIENTS, getSeverityIcon } from '../../lib/design-system';

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
  if (score >= 80) return <CheckCircle color="success" />;
  if (score >= 60) return <Warning color="warning" />;
  return <Error color="error" />;
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
      toast.showSuccess('Datos actualizados correctamente', '¡Actualización exitosa!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.showError('No se pudo actualizar los datos. Inténtalo de nuevo.', 'Error de actualización');
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
        Error al cargar los datos del dashboard: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Mejorado */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard de Seguridad
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Resumen de la seguridad digital de {userCompany?.name || 'tu empresa'}
          </Typography>
          {userCompany && (
            <Chip 
              label={`Monitoreando: ${userCompany.domain}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          size="large"
          sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' },
            '&:disabled': { backgroundColor: 'grey.300' }
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
      </Box>

      {/* Stats Cards Mejoradas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Assets Monitoreados"
            value={totalAssets}
            subtitle={totalAssets === 1 ? "Dominio activo" : "Dominios activos"}
            icon={<Shield />}
            gradient={METRIC_GRADIENTS.assets}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Puntaje de Salud Promedio"
            value={`${averageHealthScore}%`}
            subtitle={averageHealthScore >= 80 ? "Excelente seguridad 🚀" : 
                     averageHealthScore >= 60 ? "Buena seguridad ✅" :
                     averageHealthScore >= 40 ? "Requiere atención ⚠️" : "Estado crítico 🚨"}
            icon={getHealthScoreIcon(averageHealthScore)}
            gradient={METRIC_GRADIENTS.healthScore(averageHealthScore)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Vulnerabilidades Críticas"
            value={criticalFindings}
            subtitle={criticalFindings === 0 ? "Sin vulnerabilidades 🚀" : "Requieren atención inmediata"}
            icon={<Error />}
            gradient={METRIC_GRADIENTS.vulnerabilities(criticalFindings)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Vulnerabilidades Altas"
            value={highFindings}
            subtitle={highFindings === 0 ? "Todo en orden ✅" : "Revisar pronto"}
            icon={<Warning />}
            gradient={METRIC_GRADIENTS.vulnerabilities(highFindings)}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Assets Overview Mejorado */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Assets Monitoreados
                </Typography>
                <Chip 
                  label={`${assets.filter(a => a.isActive).length} activos`} 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
              </Box>
              
              {assets.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ¿Listo para empezar? 🚀
                    </Typography>
                    <Typography variant="body2">
                      Agrega tu primer dominio para comenzar a monitorear la seguridad
                    </Typography>
                  </Box>
                </Alert>
              ) : (
                <List>
                  {assets.map((asset) => (
                    <ListItem key={asset.id} divider sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Language 
                          sx={{ 
                            color: asset.isActive ? '#4caf50' : '#f57c00' // Verde activo, naranja inactivo
                          }} 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {asset.domain}
                            </Typography>
                            <Chip
                              label={asset.isActive ? 'Activo' : 'Inactivo'}
                              size="small"
                              sx={{
                                backgroundColor: asset.isActive ? '#e8f5e8' : '#fff3e0',
                                color: asset.isActive ? '#2e7d32' : '#f57c00',
                                fontWeight: 600,
                              }}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Agregado: {new Date(asset.createdAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Vulnerabilidades Recientes Mejoradas */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Vulnerabilidades Recientes
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  {recentFindings.length > 0 && (
                    <Chip 
                      label={`${recentFindings.length} total`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                  {recentFindings.length > 5 && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Severidad</InputLabel>
                      <Select
                        value={severityFilter}
                        label="Severidad"
                        onChange={(e) => setSeverityFilter(e.target.value)}
                      >
                        <MenuItem value="all">Todas</MenuItem>
                        <MenuItem value="critical">Críticas</MenuItem>
                        <MenuItem value="high">Altas</MenuItem>
                        <MenuItem value="medium">Medias</MenuItem>
                        <MenuItem value="low">Bajas</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>
              
              {recentFindings.length === 0 ? (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        ¡Excelente! No hay vulnerabilidades recientes 🚀
                      </Typography>
                      <Typography variant="body2">
                        Tu sistema está bien protegido
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
                      // Ordenar por severidad: critical > high > medium > low
                      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                      return (severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder] || 0) - 
                             (severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] || 0);
                    })
                    .slice(0, 5)
                    .map((finding) => (
                      <ListItem key={finding.id} divider sx={{ py: 2 }}>
                        <ListItemIcon>
                          <Box sx={{ fontSize: '1.5em' }}>
                            {getSeverityIcon(finding.severity)}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <Typography variant="subtitle1" fontWeight="600">
                                {finding.title}
                              </Typography>
                              <SeverityChip severity={finding.severity} />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {finding.asset.domain} • {new Date(finding.createdAt).toLocaleDateString()}
                              </Typography>
                              <Tooltip 
                                title={finding.description}
                                arrow
                                enterDelay={500}
                              >
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: '0.875rem',
                                    cursor: 'help',
                                    '&:hover': { textDecoration: 'underline' }
                                  }}
                                >
                                  {finding.description.length > 100 
                                    ? `${finding.description.substring(0, 100)}...`
                                    : finding.description
                                  }
                                </Typography>
                              </Tooltip>
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

        {/* Escaneos Recientes Mejorados */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Escaneos Recientes
                </Typography>
                {recentScans.length > 0 && (
                  <Chip 
                    label={`${recentScans.length} escaneos`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
              </Box>
              
              {recentScans.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ¡Ejecuta tu primer escaneo! 🔍
                    </Typography>
                    <Typography variant="body2">
                      Ve a la sección de Escaneos para analizar la seguridad de tus dominios
                    </Typography>
                  </Box>
                </Alert>
              ) : (
                <List>
                  {recentScans.map((scan) => (
                    <ListItem key={scan.id} divider sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Security color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="subtitle1" fontWeight="600">
                              Escaneo de {scan.domain}
                            </Typography>
                            <Chip
                              label={scan.status === 'COMPLETED' ? 'Completado' : scan.status}
                              color={scan.status === 'COMPLETED' ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {scan.findingsCount} vulnerabilidades • {new Date(scan.createdAt).toLocaleDateString()}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" color="text.secondary">
                                Health Score:
                              </Typography>
                              <HealthScoreIndicator 
                                score={scan.healthScore} 
                                size="small" 
                                showProgress={false}
                                showLabel={false}
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <HealthScoreIndicator 
                          score={scan.healthScore} 
                          size="small" 
                          showLabel={true}
                          showProgress={true}
                        />
                      </Box>
                    </ListItem>
                  ))}
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
