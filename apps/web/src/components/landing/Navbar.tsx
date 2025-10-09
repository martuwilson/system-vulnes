import { AppBar, Toolbar, Container, Stack, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecuryxLogo from '../common/SecuryxLogo';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SecuryxLogo 
              width={180} 
              height={50}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => onNavigate('home')}
            />
          </Box>

          {/* Navigation Menu */}
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography
              onClick={() => onNavigate('home')}
              sx={{ 
                color: 'white', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              Home
            </Typography>
            <Typography
              onClick={() => onNavigate('como-funciona')}
              sx={{ 
                color: 'white', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              Cómo Funciona
            </Typography>
            <Typography
              onClick={() => onNavigate('por-que-elegirnos')}
              sx={{ 
                color: 'white', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              Por qué Elegirnos
            </Typography>
            <Typography
              onClick={() => onNavigate('tipos-escaneos')}
              sx={{ 
                color: 'white', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              Tipos de Escaneos
            </Typography>
            <Typography
              onClick={() => onNavigate('precios')}
              sx={{ 
                color: 'white', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              Precios
            </Typography>
            <Typography
              onClick={() => onNavigate('faq')}
              sx={{ 
                color: 'white', 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              FAQ
            </Typography>
          </Stack>

          {/* CTA Button */}
          <Button 
            variant="contained" 
            size="small"
            sx={{ 
              backgroundColor: '#B8FF00',
              color: '#1E2A38',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(184, 255, 0, 0.3)',
              display: { xs: 'none', sm: 'flex' },
              '&:hover': {
                backgroundColor: '#A6E600',
                boxShadow: '0 6px 16px rgba(184, 255, 0, 0.4)',
              }
            }}
            onClick={() => navigate('/dashboard')}
          >
            Empezar Gratis
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
