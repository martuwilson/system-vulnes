import { Outlet } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Shield } from '@mui/icons-material';

export function AuthLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: isMobile ? 3 : 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                mb: 2,
              }}
            >
              <Shield sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              textAlign="center"
              color="primary"
              gutterBottom
            >
              Security System
            </Typography>
            
            <Typography
              variant="subtitle1"
              textAlign="center"
              color="text.secondary"
              sx={{ maxWidth: 300 }}
            >
              Plataforma de monitoreo de seguridad digital para PYMEs
            </Typography>
          </Box>

          {/* Content */}
          <Outlet />

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="caption" color="text.secondary">
              © 2025 Security System. Protegemos tu presencia digital.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
