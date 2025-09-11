import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Construction } from '@mui/icons-material';

export function FindingsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Vulnerabilidades
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestiona y analiza las vulnerabilidades de seguridad encontradas
      </Typography>

      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Página en Construcción
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
              Esta funcionalidad estará disponible próximamente. Por ahora puedes ver las vulnerabilidades 
              en la página de Dashboard y Escaneos.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 2 }}>
        <strong>Próximamente:</strong> Análisis detallado de vulnerabilidades, filtros avanzados, 
        reportes de remediación y seguimiento de estado.
      </Alert>
    </Box>
  );
}
