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
    securityScans(companyId: $companyId, limit: 10) {
      id
      domain
      createdAt
      status
      healthScore
      findingsCount
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
        // Manejar error de autorización si es necesario
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
  const allScans = scansData?.securityScans || [];

  // Función helper para obtener el último escaneo de un dominio específico
  const getLatestScanForDomain = (domain: string) => {
    const filtered = allScans.filter((scan: any) => scan.domain === domain);
    const latest = filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    return latest;
  };

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
            onClick={() => window.location.href = '/auth/login'}
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
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: '20px',
              fontWeight: 700,
              color: '#1E2A38',
              mb: 1,
              letterSpacing: '-0.5px'
            }}
          >
            Mi Empresa
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: 500,
              mb: 0.5
            }}
          >
            {formatPlural(assets.length, 'dominio monitoreado', 'dominios monitoreados')}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '13px',
              color: '#9CA3AF',
              lineHeight: 1.5
            }}
          >
            Gestiona los dominios y activos digitales de {userCompany?.name || 'tu empresa'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: '#1976D2',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            px: 3,
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
            '&:hover': {
              bgcolor: '#1565C0',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Añadir Dominio
        </Button>
      </Box>

      {/* Company Info */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(30, 42, 56, 0.08)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Box 
              sx={{ 
                mr: 3, 
                p: 2, 
                borderRadius: '12px', 
                bgcolor: '#1E2A38',
                background: 'linear-gradient(135deg, #1E2A38 0%, #2D3748 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(30, 42, 56, 0.2)'
              }}
            >
              <Business sx={{ fontSize: 28 }} />
            </Box>
            <Box flex={1}>
              <Typography 
                variant="h5" 
                sx={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1E2A38',
                  mb: 1,
                  letterSpacing: '-0.3px'
                }}
              >
                {userCompany?.name || 'Sin empresa configurada'}
              </Typography>
              {userCompany?.domain && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Launch sx={{ fontSize: 16, color: '#6B7280' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '14px',
                      color: '#1976D2',
                      fontWeight: 500,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': { 
                        color: '#1565C0',
                        textDecoration: 'underline'
                      },
                      transition: 'all 0.2s ease-in-out'
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
              label={`${assets.length} Dominios`}
              sx={{
                bgcolor: '#F3F4F6',
                color: '#1E2A38',
                fontWeight: 600,
                fontSize: '13px',
                border: '1px solid #E5E7EB',
                '&:hover': { bgcolor: '#E5E7EB' }
              }}
              variant="outlined"
            />
            <Chip 
              label={`${assets.filter(a => a.isActive).length} Activos`}
              sx={{
                bgcolor: '#AEEA00',
                color: '#1E2A38',
                fontWeight: 600,
                fontSize: '13px',
                border: 'none',
                '&:hover': { bgcolor: '#9DD600' }
              }}
            />
            <Chip 
              label={`${assets.filter(a => !a.isActive).length} Inactivos`}
              sx={{
                bgcolor: assets.filter(a => !a.isActive).length > 0 ? '#E53935' : '#F3F4F6',
                color: assets.filter(a => !a.isActive).length > 0 ? 'white' : '#6B7280',
                fontWeight: 600,
                fontSize: '13px',
                border: assets.filter(a => !a.isActive).length === 0 ? '1px solid #E5E7EB' : 'none',
                '&:hover': { 
                  bgcolor: assets.filter(a => !a.isActive).length > 0 ? '#D32F2F' : '#E5E7EB'
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card
        sx={{
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(30, 42, 56, 0.08)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h6" 
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1E2A38',
              mb: 3,
              letterSpacing: '-0.3px'
            }}
          >
            Dominios Monitoreados ({assets.length})
          </Typography>
          
          {assets.length === 0 ? (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 2,
                borderRadius: '8px',
                border: '1px solid #1976D2',
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                '& .MuiAlert-message': {
                  fontSize: '14px',
                  color: '#1E2A38'
                }
              }}
            >
              No tienes dominios registrados aún. Agrega tu primer dominio para comenzar a monitorear la seguridad digital.
            </Alert>
          ) : (
            <List sx={{ '& .MuiListItem-root': { borderRadius: '8px', mb: 2 } }}>
              {assets.map((asset) => {
                const latestScan = getLatestScanForDomain(asset.domain);
                
                return (
                <ListItem 
                  key={asset.id} 
                  sx={{ 
                    py: 3,
                    px: 3,
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: '#FAFAFA',
                      borderColor: '#D1D5DB',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(30, 42, 56, 0.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        bgcolor: '#1976D2',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Language sx={{ fontSize: 24 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: '#1E2A38',
                              letterSpacing: '-0.2px'
                            }}
                          >
                            {asset.domain}
                          </Typography>
                          {asset.isActive ? (
                            <Chip
                              size="small"
                              label="Activo"
                              sx={{
                                bgcolor: '#AEEA00',
                                color: '#1E2A38',
                                fontWeight: 600,
                                fontSize: '12px',
                                height: '24px'
                              }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label="Inactivo"
                              sx={{
                                bgcolor: '#E53935',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '12px',
                                height: '24px'
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '13px',
                            color: '#6B7280',
                            mb: 1
                          }}
                        >
                          Agregado: {formatDateTime(asset.createdAt)}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                          <Typography 
                            variant="body2" 
                            sx={{ fontSize: '13px', color: '#6B7280' }}
                          >
                            Último escaneo: 
                            <Box 
                              component="span" 
                              sx={{ 
                                color: '#1E2A38', 
                                fontWeight: 500, 
                                ml: 0.5 
                              }}
                            >
                              {latestScan 
                                ? `${formatDateTime(latestScan.createdAt)} - ${translateStatus(latestScan.status)}`
                                : 'Sin escanear aún'
                              }
                            </Box>
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ fontSize: '13px', color: '#6B7280' }}
                          >
                            Puntuación: 
                            <Box 
                              component="span" 
                              sx={{ 
                                color: latestScan?.healthScore !== undefined 
                                  ? latestScan.healthScore >= 80 ? '#AEEA00' 
                                    : latestScan.healthScore >= 60 ? '#F57C00' 
                                    : '#E53935'
                                  : '#1E2A38',
                                fontWeight: 600, 
                                ml: 0.5,
                                fontSize: '13px'
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
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        title="Escanear ahora"
                        sx={{ 
                          bgcolor: '#1976D2',
                          color: 'white',
                          width: 36,
                          height: 36,
                          '&:hover': { 
                            bgcolor: '#1565C0',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <FlashOn sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Editar dominio"
                        sx={{ 
                          bgcolor: '#F3F4F6',
                          color: '#6B7280',
                          width: 36,
                          height: 36,
                          '&:hover': { 
                            bgcolor: '#E5E7EB',
                            color: '#1E2A38',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Edit sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(asset.id, asset.domain)}
                        title="Eliminar"
                        sx={{ 
                          bgcolor: '#E53935',
                          color: 'white',
                          width: 36,
                          height: 36,
                          '&:hover': { 
                            bgcolor: '#D32F2F',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(30, 42, 56, 0.15)'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1E2A38',
            borderBottom: '1px solid #E5E7EB',
            pb: 2
          }}
        >
          Añadir Nuevo Dominio
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '14px',
              color: '#6B7280',
              mb: 3,
              lineHeight: 1.5
            }}
          >
            Agrega un dominio para monitorear su seguridad digital y recibir alertas de vulnerabilidades
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '14px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: '#1976D2'
                }
              },
              '& .MuiFormHelperText-root': {
                fontSize: '12px',
                color: '#6B7280'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{
              color: '#6B7280',
              fontWeight: 500,
              fontSize: '14px',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                bgcolor: '#F3F4F6',
                color: '#1E2A38'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !domain.trim()}
            sx={{
              bgcolor: '#1976D2',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px',
              textTransform: 'none',
              px: 4,
              py: 1,
              borderRadius: '8px',
              minWidth: '100px',
              '&:hover': {
                bgcolor: '#1565C0'
              },
              '&:disabled': {
                bgcolor: '#E5E7EB',
                color: '#9CA3AF'
              }
            }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Añadir Dominio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
