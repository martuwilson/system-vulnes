import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { 
  Email, 
  Https, 
  NetworkCheck, 
  BugReport,
  Security,
  Public,
  VpnLock,
  FindInPage,
  Business,
  Lock
} from '@mui/icons-material';

interface ScanType {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface ScanCategory {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  scans: ScanType[];
}

const scanCategories: ScanCategory[] = [
  {
    title: 'Tu Negocio Online',
    subtitle: 'Lo que tus clientes ven',
    icon: <Business sx={{ fontSize: 32, color: '#1E2A38' }} />,
    color: '#1E2A38',
    scans: [
      { 
        icon: <Https sx={{ fontSize: 40, color: '#1E2A38' }} />, 
        name: 'Certificados de Seguridad', 
        description: 'Verificamos que tu sitio sea confiable para tus clientes' 
      },
      { 
        icon: <FindInPage sx={{ fontSize: 40, color: '#1E2A38' }} />, 
        name: 'Contenido del Sitio', 
        description: 'Revisamos que tu página cargue correctamente y sin errores' 
      },
      { 
        icon: <Public sx={{ fontSize: 40, color: '#1E2A38' }} />, 
        name: 'Configuración Web', 
        description: 'Chequeamos que tu dominio esté bien configurado' 
      }
    ]
  },
  {
    title: 'Tu Comunicación',
    subtitle: 'Cómo llegan tus emails',
    icon: <Email sx={{ fontSize: 32, color: '#00B8D9' }} />,
    color: '#00B8D9',
    scans: [
      { 
        icon: <Email sx={{ fontSize: 40, color: '#00B8D9' }} />, 
        name: 'Seguridad del Email', 
        description: 'Verificamos que tus emails no caigan en spam' 
      }
    ]
  },
  {
    title: 'Tu Protección',
    subtitle: 'Lo que no se ve pero te cuida',
    icon: <Lock sx={{ fontSize: 32, color: '#AEEA00' }} />,
    color: '#AEEA00',
    scans: [
      { 
        icon: <Security sx={{ fontSize: 40, color: '#AEEA00' }} />, 
        name: 'Vulnerabilidades Web', 
        description: 'Buscamos agujeros que hackers podrían usar para entrar' 
      },
      { 
        icon: <NetworkCheck sx={{ fontSize: 40, color: '#AEEA00' }} />, 
        name: 'Blindaje del Sitio', 
        description: 'Revisamos las defensas invisibles de tu página' 
      },
      { 
        icon: <BugReport sx={{ fontSize: 40, color: '#AEEA00' }} />, 
        name: 'Puertos de Entrada', 
        description: 'Verificamos que no haya puertas abiertas sin necesidad' 
      },
      { 
        icon: <VpnLock sx={{ fontSize: 40, color: '#AEEA00' }} />, 
        name: 'Encriptación Avanzada', 
        description: 'Confirmamos que la comunicación esté bien protegida' 
      }
    ]
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
              color: '#AEEA00',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2
            }}
          >
            Revisión Completa
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Lo Que Analizamos
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
            Revisamos cada aspecto de tu presencia digital para que tengas tranquilidad total
          </Typography>
        </Box>

        {scanCategories.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 6 }}>
            {/* Category Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${category.color}20`
                }}
              >
                {category.icon}
                <Box sx={{ textAlign: 'left' }}>
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    sx={{ color: category.color, mb: 0.5 }}
                  >
                    {category.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: '#64748b' }}
                  >
                    {category.subtitle}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Category Items */}
            <Grid container spacing={3} justifyContent="center">
              {category.scans.map((scan, scanIndex) => (
                <Grid item xs={12} sm={6} md={4} key={scanIndex}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      height: '100%',
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${category.color}20`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${category.color}20`,
                        borderColor: category.color,
                        '& .scan-icon': {
                          transform: 'scale(1.1)'
                        }
                      }
                    }}
                  >
                    <Box 
                      className="scan-icon"
                      sx={{ 
                        mb: 2,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {scan.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      fontWeight={600}
                      sx={{ 
                        color: '#1E2A38',
                        mb: 2,
                        fontSize: '1.1rem'
                      }}
                    >
                      {scan.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}
                    >
                      {scan.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#1E2A38',
              mb: 2,
              fontWeight: 600
            }}
          >
            ¿Tu negocio está realmente protegido?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              mb: 4,
              fontSize: '1.1rem',
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            Descubrí en 5 minutos qué riesgos tiene tu sitio web y cómo solucionarlos paso a paso
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              background: 'linear-gradient(135deg, #AEEA00 0%, #00B8D9 100%)',
              color: '#1E2A38',
              px: 6,
              py: 3,
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(174, 234, 0, 0.3)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 30px rgba(174, 234, 0, 0.4)',
                '& .cta-icon': {
                  transform: 'scale(1.1) rotate(5deg)'
                }
              }
            }}
          >
            <Security 
              className="cta-icon"
              sx={{ 
                color: '#1E2A38',
                transition: 'all 0.3s ease'
              }} 
            />
            <Typography 
              variant="body1" 
              fontWeight={700} 
              sx={{ color: '#1E2A38' }}
            >
              Comenzar Análisis Gratuito
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              mt: 2,
              fontSize: '0.9rem'
            }}
          >
            ✓ Sin compromisos ✓ Resultados en minutos ✓ Recomendaciones claras
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
