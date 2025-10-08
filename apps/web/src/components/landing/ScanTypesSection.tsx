import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { 
  Email, 
  Https, 
  NetworkCheck, 
  BugReport,
  Security,
  Public,
  VpnLock,
  FindInPage
} from '@mui/icons-material';

interface ScanType {
  icon: React.ReactNode;
  name: string;
  description: string;
}

const scanTypes: ScanType[] = [
  { 
    icon: <Email sx={{ fontSize: 40 }} />, 
    name: 'Email Security', 
    description: 'SPF, DKIM, DMARC' 
  },
  { 
    icon: <Https sx={{ fontSize: 40 }} />, 
    name: 'SSL Certificate', 
    description: 'Validez y expiración' 
  },
  { 
    icon: <NetworkCheck sx={{ fontSize: 40 }} />, 
    name: 'Security Headers', 
    description: 'HSTS, CSP, X-Frame' 
  },
  { 
    icon: <BugReport sx={{ fontSize: 40 }} />, 
    name: 'Port Scanner', 
    description: 'Puertos críticos abiertos' 
  },
  { 
    icon: <Security sx={{ fontSize: 40 }} />, 
    name: 'Web Vulnerabilities', 
    description: 'XSS, SQL Injection, CSRF' 
  },
  { 
    icon: <Public sx={{ fontSize: 40 }} />, 
    name: 'DNS Security', 
    description: 'Configuración y propagación' 
  },
  { 
    icon: <VpnLock sx={{ fontSize: 40 }} />, 
    name: 'TLS Configuration', 
    description: 'Protocolos y cifrados' 
  },
  { 
    icon: <FindInPage sx={{ fontSize: 40 }} />, 
    name: 'Content Security', 
    description: 'Análisis de contenido web' 
  }
];

export function ScanTypesSection() {
  return (
    <Box 
      id="tipos-escaneos" 
      sx={{ 
        py: 10,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#3b82f6',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2
            }}
          >
            Cobertura Completa
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Tipos de Escaneo
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Cobertura completa de vectores de ataque comunes para proteger tu negocio digital
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {scanTypes.map((scan, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    '& .scan-icon': {
                      transform: 'scale(1.1)',
                      color: '#3b82f6'
                    }
                  }
                }}
              >
                <Box 
                  className="scan-icon"
                  sx={{ 
                    color: '#64748b', 
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {scan.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  fontWeight={700}
                  sx={{ 
                    color: '#1e293b',
                    mb: 2
                  }}
                >
                  {scan.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b',
                    lineHeight: 1.6
                  }}
                >
                  {scan.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              mb: 3,
              fontSize: '1.1rem'
            }}
          >
            ¿Querés ver qué vulnerabilidades tiene tu sitio web?
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(10px)',
              px: 4,
              py: 2,
              borderRadius: 2,
              border: '2px solid rgba(59, 130, 246, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6'
              }
            }}
          >
            <Security sx={{ color: '#3b82f6' }} />
            <Typography 
              variant="body1" 
              fontWeight={600} 
              sx={{ color: '#3b82f6' }}
            >
              Chequeá tu sitio ahora - Es gratis
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
