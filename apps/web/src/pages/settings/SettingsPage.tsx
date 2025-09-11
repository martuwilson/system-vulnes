import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';

export function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Configuración
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestiona la configuración de tu cuenta y empresa
      </Typography>

      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Página en Construcción
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
              Esta funcionalidad estará disponible próximamente. Aquí podrás configurar 
              notificaciones, preferencias de escaneo y más.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 2 }}>
        <strong>Próximamente:</strong> Configuración de notificaciones, intervalos de escaneo, 
        integrations con herramientas externas y preferencias de usuario.
      </Alert>
    </Box>
  );
}
