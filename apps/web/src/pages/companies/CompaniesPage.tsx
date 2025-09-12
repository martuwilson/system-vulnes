import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { 
  Add, 
  Business, 
  Delete, 
  CheckCircle, 
  Warning, 
  Launch, 
  FlashOn, 
  Edit,
  Language
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { formatDateTime, translateStatus } from '../../lib/translations';

// Función helper para plurales
const formatPlural = (count: number, singular: string, plural: string) => {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
};

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
    securityScans(companyId: $companyId, limit: 5) {
      id
      createdAt
      status
      healthScore
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
        console.log('Error de autorización - token posiblemente expirado');
        console.log('Token actual:', localStorage.getItem('accessToken') ? 'Presente' : 'Ausente');
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
  const latestScan = scansData?.securityScans?.[0]; // Último scan de la empresa

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
            onClick={() => window.location.href = '/login'}
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

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Activos de la Empresa
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {formatPlural(assets.length, 'dominio monitoreado', 'dominios monitoreados')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona los dominios y activos de {userCompany?.name || 'tu empresa'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          size="large"
        >
          + Añadir dominio
        </Button>
      </Box>

      {/* Company Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Box 
              sx={{ 
                mr: 2, 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Business sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                {userCompany?.name || 'Sin empresa'}
              </Typography>
              {userCompany?.domain && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Launch sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography 
                    variant="body1" 
                    color="primary" 
                    sx={{ 
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.dark' }
                    }}
                    onClick={() => window.open(`https://${userCompany.domain}`, '_blank')}
                  >
                    {userCompany.domain}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip 
              label={formatPlural(assets.length, 'Total', 'Total')} 
              color="default" 
              variant="outlined"
            />
            <Chip 
              label={formatPlural(assets.filter(a => a.isActive).length, 'Activo', 'Activos')} 
              color="success" 
            />
            <Chip 
              label={formatPlural(assets.filter(a => !a.isActive).length, 'Inactivo', 'Inactivos')} 
              color={assets.filter(a => !a.isActive).length > 0 ? "error" : "default"}
              variant={assets.filter(a => !a.isActive).length > 0 ? "filled" : "outlined"}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Dominios monitoreados: {assets.length}
          </Typography>
          
          {assets.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No tienes assets registrados aún. Agrega tu primer dominio para comenzar a monitorear la seguridad.
            </Alert>
          ) : (
            <List sx={{ '& .MuiListItem-root': { borderRadius: 2, mb: 1 } }}>
              {assets.map((asset) => (
                <ListItem key={asset.id} divider sx={{ py: 3 }}>
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Language color="primary" sx={{ fontSize: 32 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h6" fontWeight="600" color="text.primary">
                            {asset.domain}
                          </Typography>
                          {asset.isActive ? (
                            <CheckCircle color="success" sx={{ fontSize: 24 }} />
                          ) : (
                            <Warning color="warning" sx={{ fontSize: 24 }} />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Agregado: {formatDateTime(asset.createdAt)}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={4}>
                          <Typography variant="body2" color="text.secondary">
                            Último escaneo: 
                            <Box component="span" sx={{ color: 'text.primary', fontWeight: 500, ml: 0.5 }}>
                              {latestScan 
                                ? `${formatDateTime(latestScan.createdAt)} - ${translateStatus(latestScan.status)}`
                                : 'Sin escanear aún'
                              }
                            </Box>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Health Score: 
                            <Box 
                              component="span" 
                              sx={{ 
                                color: latestScan?.healthScore !== undefined 
                                  ? latestScan.healthScore >= 80 ? 'success.main' 
                                    : latestScan.healthScore >= 60 ? 'warning.main' 
                                    : 'error.main'
                                  : 'text.primary',
                                fontWeight: 500, 
                                ml: 0.5 
                              }}
                            >
                              {latestScan?.healthScore !== undefined 
                                ? `${latestScan.healthScore}%`
                                : 'Pendiente'
                              }
                            </Box>
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <IconButton
                        size="medium"
                        color="primary"
                        title="Escanear ahora"
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        <FlashOn sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        size="medium"
                        color="default"
                        title="Editar dominio"
                        sx={{ 
                          bgcolor: 'grey.100',
                          '&:hover': { bgcolor: 'grey.200' }
                        }}
                      >
                        <Edit sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        size="medium"
                        onClick={() => handleDelete(asset.id, asset.domain)}
                        color="error"
                        title="Eliminar"
                        sx={{ 
                          bgcolor: 'error.light',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.main' }
                        }}
                      >
                        <Delete sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Añadir Nuevo Dominio</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Agrega un dominio para monitorear su seguridad digital
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Dominio"
            placeholder="ejemplo.com"
            fullWidth
            variant="outlined"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            helperText="Ingresa el dominio sin http:// o https://"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !domain.trim()}
          >
            {loading ? <CircularProgress size={20} /> : 'Añadir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
