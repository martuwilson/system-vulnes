import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Notifications,
  Security,
  Schedule,
  Email,
  Language,
  Storage,
  Settings,
  Edit,
  Delete,
  Add,
  ExpandMore,
  Save,
  RestartAlt,
  Shield,
  Domain,
  Timer,
  NotificationsActive,
} from '@mui/icons-material';
import { useState } from 'react';

export function SettingsPage() {
  // Estados para configuraciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [scanInterval, setScanInterval] = useState('24');
  const [autoResolve, setAutoResolve] = useState(false);
  const [dataRetention, setDataRetention] = useState('90');
  const [emailAddress, setEmailAddress] = useState('willner.martin@gmail.com');
  const [companyName, setCompanyName] = useState('Mi Empresa');
  
  // Estados para dominios
  const [domains, setDomains] = useState(['dalone.com.ar', 'laburen.com']);
  const [newDomain, setNewDomain] = useState('');
  const [addDomainOpen, setAddDomainOpen] = useState(false);

  const handleSaveSettings = () => {
    // TODO: Implementar guardado de configuraciones
    console.log('Guardando configuraciones...');
  };

  const handleAddDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain('');
      setAddDomainOpen(false);
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Configuración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona la configuración de tu cuenta y empresa
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveSettings}
        >
          Guardar Cambios
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Configuración de Notificaciones */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <NotificationsActive color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Notificaciones
                </Typography>
              </Box>

              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  }
                  label="Notificaciones por email"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                  }
                  label="Notificaciones push"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={criticalOnly}
                      onChange={(e) => setCriticalOnly(e.target.checked)}
                    />
                  }
                  label="Solo vulnerabilidades críticas"
                />

                <TextField
                  label="Email para notificaciones"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  type="email"
                  fullWidth
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Escaneos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Timer color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Configuración de Escaneos
                </Typography>
              </Box>

              <Stack spacing={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Intervalo de escaneo</InputLabel>
                  <Select
                    value={scanInterval}
                    label="Intervalo de escaneo"
                    onChange={(e) => setScanInterval(e.target.value)}
                  >
                    <MenuItem value="6">Cada 6 horas</MenuItem>
                    <MenuItem value="12">Cada 12 horas</MenuItem>
                    <MenuItem value="24">Cada 24 horas</MenuItem>
                    <MenuItem value="72">Cada 3 días</MenuItem>
                    <MenuItem value="168">Semanal</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={autoResolve}
                      onChange={(e) => setAutoResolve(e.target.checked)}
                    />
                  }
                  label="Auto-resolver vulnerabilidades solucionadas"
                />

                <FormControl fullWidth size="small">
                  <InputLabel>Retención de datos</InputLabel>
                  <Select
                    value={dataRetention}
                    label="Retención de datos"
                    onChange={(e) => setDataRetention(e.target.value)}
                  >
                    <MenuItem value="30">30 días</MenuItem>
                    <MenuItem value="90">90 días</MenuItem>
                    <MenuItem value="180">6 meses</MenuItem>
                    <MenuItem value="365">1 año</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Información de la Empresa */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Settings color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Información de la Empresa
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre de la empresa"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email del administrador"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    type="email"
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Gestión de Dominios */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Domain color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Dominios Monitoreados
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setAddDomainOpen(true)}
                >
                  Agregar Dominio
                </Button>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {domains.map((domain) => (
                  <Chip
                    key={domain}
                    label={domain}
                    onDelete={() => handleRemoveDomain(domain)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>

              {domains.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No hay dominios configurados. Agrega al menos un dominio para comenzar a monitorear.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Configuraciones Avanzadas */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Shield color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Configuraciones Avanzadas
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Alert severity="warning">
                  <strong>Advertencia:</strong> Estas configuraciones son para usuarios avanzados. 
                  Cambiar estos valores puede afectar el funcionamiento del sistema.
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Timeout de escaneo (segundos)"
                      defaultValue="30"
                      type="number"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Máximo intentos de reconexión"
                      defaultValue="3"
                      type="number"
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Habilitar logs detallados"
                />

                <Box display="flex" gap={2}>
                  <Button variant="outlined" startIcon={<RestartAlt />}>
                    Reiniciar Servicios
                  </Button>
                  <Button variant="outlined" color="error">
                    Limpiar Cache
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Dialog para agregar dominio */}
      <Dialog open={addDomainOpen} onClose={() => setAddDomainOpen(false)}>
        <DialogTitle>Agregar Nuevo Dominio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Dominio"
            placeholder="ejemplo.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDomainOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddDomain} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Alert severity="success" sx={{ mt: 3 }}>
        <strong>Sistema configurado correctamente.</strong> Todas las configuraciones se guardan automáticamente.
      </Alert>
    </Box>
  );
}
