import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Stack,
  Button,
  Tooltip
} from '@mui/material';
import SecuryxLogo from '../common/SecuryxLogo';
import { 
  Shield, 
  Lock, 
  Security, 
  Verified, 
  AccountBalance,
  FlashOn,
  Favorite,
  Flag,
  LinkedIn,
  Twitter,
  YouTube,
  ArrowForward
} from '@mui/icons-material';

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Features' },
      { label: 'Precios' },
      { label: 'Integraciones' },
      { label: 'API Docs' }
    ]
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Blog' },
      { label: 'Guías' },
      { label: 'Webinars' },
      { label: 'Casos de Éxito' }
    ]
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de Ayuda' },
      { label: 'FAQ' },
      { label: 'Status del Sistema' },
      { label: 'Contacto' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos de Uso' },
      { label: 'Privacidad' },
      { label: 'Cookies' },
      { label: 'SLA' }
    ]
  }
];

const certifications = [
  { 
    icon: <Verified sx={{ color: '#AEEA00', fontSize: 18 }} />, 
    label: 'ISO 27001:2022',
    description: 'Certificación internacional de seguridad de la información'
  },
  { 
    icon: <Shield sx={{ color: '#00B8D9', fontSize: 18 }} />, 
    label: 'SOC 2 Type II',
    description: 'Auditoría de controles de seguridad operacional'
  },
  { 
    icon: <Lock sx={{ color: '#1E2A38', fontSize: 18 }} />, 
    label: 'GDPR Compliant',
    description: 'Cumplimiento de protección de datos europeos'
  },
  { 
    icon: <Security sx={{ color: '#AEEA00', fontSize: 18 }} />, 
    label: 'OWASP Aligned',
    description: 'Siguiendo mejores prácticas de seguridad web'
  }
];

const stats = [
  { icon: <AccountBalance fontSize="small" sx={{ color: '#AEEA00' }} />, label: '+150 PyMEs duermen tranquilas' },
  { icon: <Shield fontSize="small" sx={{ color: '#00B8D9' }} />, label: '+2,400 problemas evitados' },
  { icon: <FlashOn fontSize="small" sx={{ color: '#AEEA00' }} />, label: '24/7 vigilando tu negocio' }
];

const socialLinks = [
  { label: 'LinkedIn', icon: <LinkedIn sx={{ fontSize: 20 }} /> },
  { label: 'Twitter', icon: <Twitter sx={{ fontSize: 20 }} /> },
  { label: 'YouTube', icon: <YouTube sx={{ fontSize: 20 }} /> }
];

export function FooterSection() {
  return (
    <Box sx={{ bgcolor: '#212121', color: 'white', py: 8 }}>
      <Container maxWidth="lg">
        {/* Discrete Trust Bar */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="body2" sx={{ color: 'grey.500', mb: 2, fontSize: '0.85rem' }}>
            Protección certificada y confiable
          </Typography>
          <Stack 
            direction="row"
            spacing={3} 
            justifyContent="center" 
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: 1 }}
          >
            {certifications.map((cert, index) => (
              <Tooltip 
                key={index} 
                title={cert.description}
                arrow
                placement="top"
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  cursor: 'pointer',
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                  transition: 'opacity 0.3s ease'
                }}>
                  {cert.icon}
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'grey.400' }}>
                    {cert.label}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Stack>
        </Box>

        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 3 }}>
              <SecuryxLogo 
                width={200} 
                height={60}
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(174, 234, 0, 0.2))',
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: 'grey.300', mb: 3, lineHeight: 1.6 }}>
              Protección digital confiable, creada por expertos argentinos para empresas reales como la tuya. 
              <Box component="span" sx={{ color: '#AEEA00', fontWeight: 600 }}>
                Porque tu tranquilidad no tiene precio.
              </Box>
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Typography 
                  key={index}
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: 'grey.300',
                    fontSize: '0.95rem'
                  }}
                >
                  {stat.icon}
                  {stat.label}
                </Typography>
              ))}
            </Stack>
            
            {/* CTA Final */}
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #AEEA00 0%, #00B8D9 100%)',
                color: '#1E2A38',
                fontWeight: 700,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(174, 234, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(174, 234, 0, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Probá Securyx Gratis
            </Button>
          </Grid>
          
          {/* Footer Links - Mobile Optimized */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={4}>
              {footerSections.map((section, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#AEEA00',
                      fontSize: '1rem',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={1.5}>
                    {section.links.map((link, linkIndex) => (
                      <Typography 
                        key={linkIndex}
                        variant="body2" 
                        sx={{ 
                          color: 'grey.400',
                          cursor: 'pointer', 
                          fontSize: '0.9rem',
                          '&:hover': { 
                            color: '#00B8D9',
                            transform: 'translateX(4px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {link.label}
                      </Typography>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        
        {/* Bottom Bar */}
        <Box sx={{ borderTop: '1px solid #333', mt: 8, pt: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                justifyContent: { xs: 'center', md: 'flex-start' },
                flexWrap: 'wrap'
              }}>
                <Typography variant="body2" color="grey.500" sx={{ fontSize: '0.85rem' }}>
                  © 2025 Securyx. Todos los derechos reservados. | Hecho con
                </Typography>
                <Favorite sx={{ color: '#AEEA00', fontSize: 16 }} />
                <Typography variant="body2" color="grey.500" sx={{ fontSize: '0.85rem' }}>
                  en Argentina
                </Typography>
                <Flag sx={{ color: '#00B8D9', fontSize: 16 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Stack 
                direction="row" 
                spacing={3} 
                justifyContent={{ xs: 'center', md: 'flex-end' }}
                alignItems="center"
              >
                <Typography variant="body2" color="grey.500" sx={{ fontSize: '0.85rem' }}>
                  Seguinos:
                </Typography>
                {socialLinks.map((social, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'grey.400',
                      cursor: 'pointer',
                      '&:hover': { 
                        color: '#AEEA00',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {social.icon}
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
