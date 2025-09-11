import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Security,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Shield,
  Language,
  Lock,
  NetworkCheck,
} from '@mui/icons-material';

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

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

const getHealthScoreColor = (score: number) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

const getHealthScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle color="success" />;
  if (score >= 60) return <Warning color="warning" />;
  return <Error color="error" />;
};

export function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard de Seguridad
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Resumen de la seguridad digital de {userCompany?.name || 'tu empresa'}
          </Typography>
        </Box>
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          size="large"
          sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': { backgroundColor: 'primary.dark' }
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

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalAssets}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Assets Monitoreados
                  </Typography>
                </Box>
                <Shield sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${getHealthScoreColor(averageHealthScore) === 'success' ? '#4facfe 0%, #00f2fe 100%' : getHealthScoreColor(averageHealthScore) === 'warning' ? '#f093fb 0%, #f5576c 100%' : '#ff9a9e 0%, #fecfef 100%'})`, color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {averageHealthScore}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Health Score Promedio
                  </Typography>
                </Box>
                {getHealthScoreIcon(averageHealthScore)}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {criticalFindings}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Vulnerabilidades Críticas
                  </Typography>
                </Box>
                <Error sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {highFindings}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Vulnerabilidades Altas
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Assets Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Assets Monitoreados
              </Typography>
              
              {assets.length === 0 ? (
                <Alert severity="info">
                  No tienes assets monitoreados aún. Agrega tu primer dominio para comenzar.
                </Alert>
              ) : (
                <List>
                  {assets.map((asset) => (
                    <ListItem key={asset.id} divider>
                      <ListItemIcon>
                        <Language color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={asset.domain}
                        secondary={`Agregado: ${new Date(asset.createdAt).toLocaleDateString()}`}
                      />
                      <Box>
                        <Chip
                          label={asset.isActive ? 'Activo' : 'Inactivo'}
                          color={asset.isActive ? 'success' : 'default'}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Vulnerabilities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Vulnerabilidades Recientes
              </Typography>
              
              {recentFindings.length === 0 ? (
                <Alert severity="success">
                  ¡Excelente! No se encontraron vulnerabilidades recientes.
                </Alert>
              ) : (
                <List>
                  {recentFindings.slice(0, 5).map((finding) => (
                    <ListItem key={finding.id} divider>
                      <ListItemIcon>
                        {finding.category === 'EMAIL_SECURITY' && <Language />}
                        {finding.category === 'SSL_CERTIFICATE' && <Lock />}
                        {finding.category === 'SECURITY_HEADERS' && <Security />}
                        {finding.category === 'PORT_SCAN' && <NetworkCheck />}
                      </ListItemIcon>
                      <ListItemText
                        primary={finding.title}
                        secondary={`${finding.asset.domain} • ${new Date(finding.createdAt).toLocaleDateString()}`}
                      />
                      <Chip
                        label={finding.severity}
                        color={getSeverityColor(finding.severity) as any}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Scans */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Escaneos Recientes
              </Typography>
              
              {recentScans.length === 0 ? (
                <Alert severity="info">
                  No hay escaneos recientes. Ejecuta tu primer escaneo de seguridad.
                </Alert>
              ) : (
                <List>
                  {recentScans.map((scan) => (
                    <ListItem key={scan.id} divider>
                      <ListItemIcon>
                        <Security color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Escaneo de ${scan.domain}`}
                        secondary={`${scan.findingsCount} vulnerabilidades encontradas • ${new Date(scan.createdAt).toLocaleDateString()}`}
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        {scan.healthScore !== undefined && (
                          <Box display="flex" alignItems="center" gap={1} mr={2}>
                            <Typography variant="body2">Health Score:</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={scan.healthScore}
                              color={getHealthScoreColor(scan.healthScore) as any}
                              sx={{ width: 100, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {scan.healthScore}%
                            </Typography>
                          </Box>
                        )}
                        <Chip
                          label={scan.status}
                          color={scan.status === 'COMPLETED' ? 'success' : 'default'}
                          size="small"
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
    </Box>
  );
}
