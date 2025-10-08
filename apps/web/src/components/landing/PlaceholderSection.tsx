import { Box, Container, Typography } from '@mui/material';

interface PlaceholderSectionProps {
  id: string;
  title: string;
  subtitle: string;
  background?: string;
}

export function PlaceholderSection({ id, title, subtitle, background = '#f8fafc' }: PlaceholderSectionProps) {
  return (
    <Box 
      id={id}
      sx={{ 
        py: 12,
        bgcolor: background,
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
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
            {title}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4
            }}
          >
            {subtitle}
          </Typography>
          <Box 
            sx={{ 
              p: 4, 
              border: '2px dashed #3b82f6', 
              borderRadius: 2, 
              bgcolor: 'rgba(59, 130, 246, 0.05)' 
            }}
          >
            <Typography variant="body1" sx={{ color: '#3b82f6', fontWeight: 600 }}>
              📋 Sección "{title}" pendiente de modularizar
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Esta sección será extraída del archivo original y convertida en un componente modular
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
