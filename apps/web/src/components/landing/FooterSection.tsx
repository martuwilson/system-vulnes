import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Stack
} from '@mui/material';
import { 
  Shield, 
  Lock, 
  Security, 
  Verified, 
  AccountBalance,
  FlashOn,
  Favorite,
  Flag
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
  { icon: <Verified sx={{ color: '#2ecc71' }} />, label: 'ISO 27001:2022' },
  { icon: <Shield sx={{ color: '#00b8d9' }} />, label: 'SOC 2 Type II' },
  { icon: <Lock sx={{ color: '#ffa726' }} />, label: 'GDPR Compliant' },
  { icon: <Security sx={{ color: '#e91e63' }} />, label: 'OWASP Aligned' }
];

const stats = [
  { icon: <AccountBalance fontSize="small" />, label: '+150 empresas protegidas' },
  { icon: <Shield fontSize="small" />, label: '+2,400 vulnerabilidades detectadas' },
  { icon: <FlashOn fontSize="small" />, label: '99.9% uptime garantizado' }
];

const socialLinks = [
  { label: 'LinkedIn' },
  { label: 'Twitter' },
  { label: 'YouTube' }
];

export function FooterSection() {
  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        {/* Trust Bar */}
        <Box sx={{ textAlign: 'center', mb: 6, pb: 4, borderBottom: '1px solid #333' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#ff4757' }}>
            Certificaciones y Compliance Securyx
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={4} 
            justifyContent="center" 
            alignItems="center"
          >
            {certifications.map((cert, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {cert.icon}
                <Typography variant="body2">{cert.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 900,
                  color: '#ff4757',
                  mb: 0.5
                }}
              >
                Securyx
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 300,
                  color: 'grey.500',
                  fontStyle: 'italic',
                  textAlign: 'left',
                  pl: 1
                }}
              >
                PyME
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400" sx={{ mb: 3 }}>
              Líder en protección digital para PyMEs en América Latina. 
              Protegé tu negocio con tecnología empresarial al alcance de todos.
            </Typography>
            <Stack spacing={1}>
              {stats.map((stat, index) => (
                <Typography 
                  key={index}
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    color: 'grey.400'
                  }}
                >
                  {stat.icon}
                  {stat.label}
                </Typography>
              ))}
            </Stack>
          </Grid>
          
          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <Grid item xs={12} md={2} key={index}>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link, linkIndex) => (
                  <Typography 
                    key={linkIndex}
                    variant="body2" 
                    color="grey.400" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { color: 'white' },
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        
        {/* Bottom Bar */}
        <Box sx={{ borderTop: '1px solid #333', mt: 6, pt: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                justifyContent: { xs: 'center', md: 'flex-start' },
                flexWrap: 'wrap'
              }}>
                <Typography variant="body2" color="grey.500">
                  © 2025 Securyx. Todos los derechos reservados. | Hecho con
                </Typography>
                <Favorite sx={{ color: '#ef4444', fontSize: 16 }} />
                <Typography variant="body2" color="grey.500">
                  en Argentina
                </Typography>
                <Flag sx={{ color: '#3b82f6', fontSize: 16 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent={{ xs: 'center', md: 'flex-end' }}
                alignItems="center"
              >
                <Typography variant="body2" color="grey.500">
                  Síguenos:
                </Typography>
                {socialLinks.map((social, index) => (
                  <Typography 
                    key={index}
                    variant="body2" 
                    color="grey.400" 
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { color: '#ff4757' },
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {social.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
