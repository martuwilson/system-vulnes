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
import { Add, Business, Delete, CheckCircle, Warning, Launch } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../lib/translations';

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

  const [createAsset] = useMutation(CREATE_ASSET, {
    refetchQueries: ['GetCompanyAssets'],
  });
  const [deleteAsset] = useMutation(DELETE_ASSET, {
    refetchQueries: ['GetCompanyAssets'],
  });

  const assets: Asset[] = data?.companyAssets || [];

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
          + Nuevo Activo
        </Button>
      </Box>

      {/* Company Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Business color="primary" sx={{ mr: 2, fontSize: 40 }} />
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
              label={`${assets.length} Total`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`${assets.filter(a => a.isActive).length} Activos`} 
              color="success" 
            />
            <Chip 
              label={`${assets.filter(a => !a.isActive).length} Inactivos`} 
              color={assets.filter(a => !a.isActive).length > 0 ? "error" : "default"}
              variant={assets.filter(a => !a.isActive).length > 0 ? "filled" : "outlined"}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Dominios monitoreados: {assets.length}
          </Typography>
          
          {assets.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No tienes assets registrados aún. Agrega tu primer dominio para comenzar a monitorear la seguridad.
            </Alert>
          ) : (
            <List>
              {assets.map((asset) => (
                <ListItem key={asset.id} divider>
                  <ListItemIcon>
                    {asset.isActive ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Warning color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {asset.domain}
                          </Typography>
                          <Chip
                            label={asset.isActive ? 'Activo' : 'Inactivo'}
                            size="small"
                            color={asset.isActive ? 'success' : 'warning'}
                            variant="outlined"
                            icon={asset.isActive ? <CheckCircle sx={{ fontSize: 16 }} /> : <Warning sx={{ fontSize: 16 }} />}
                          />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            Agregado: {formatDateTime(asset.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Typography variant="body2" color="text.secondary">
                          Último escaneo: Pendiente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Health Score: N/A
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(asset.id, asset.domain)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Activo</DialogTitle>
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
            {loading ? <CircularProgress size={20} /> : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
