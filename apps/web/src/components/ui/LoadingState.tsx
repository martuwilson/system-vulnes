import {
  Box,
  CircularProgress,
  Typography,
  Fade,
  useTheme,
} from '@mui/material';
import { Scanner, Security } from '@mui/icons-material';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'pulse' | 'scan';
  fullScreen?: boolean;
}

export function LoadingState({
  message = 'Cargando...',
  size = 'medium',
  variant = 'spinner',
  fullScreen = false,
}: LoadingStateProps) {
  const theme = useTheme();

  const sizeConfig = {
    small: { spinner: 24, icon: 32, text: 'body2' as const },
    medium: { spinner: 40, icon: 48, text: 'body1' as const },
    large: { spinner: 56, icon: 64, text: 'h6' as const },
  };

  const config = sizeConfig[size];

  const renderSpinner = () => (
    <CircularProgress
      size={config.spinner}
      thickness={4}
      sx={{
        color: theme.palette.primary.main,
      }}
    />
  );

  const renderPulse = () => (
    <Box
      sx={{
        width: config.icon,
        height: config.icon,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
        },
      }}
    />
  );

  const renderScan = () => (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Scanner
        sx={{
          fontSize: config.icon,
          color: theme.palette.primary.main,
          animation: 'scan 2s ease-in-out infinite',
          '@keyframes scan': {
            '0%, 100%': {
              transform: 'scale(1) rotate(0deg)',
            },
            '50%': {
              transform: 'scale(1.1) rotate(180deg)',
            },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: config.icon + 16,
          height: config.icon + 16,
          borderRadius: '50%',
          border: `2px solid ${theme.palette.primary.main}`,
          borderTop: '2px solid transparent',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }}
      />
    </Box>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'pulse':
        return renderPulse();
      case 'scan':
        return renderScan();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 3,
        }}
      >
        {renderVariant()}
        
        <Typography
          variant={config.text}
          color="text.secondary"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: 300,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

// Componente específico para escaneos de seguridad
export function ScanningState({
  domain,
  progress,
}: {
  domain?: string;
  progress?: number;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Security
          sx={{
            fontSize: 64,
            color: theme.palette.primary.main,
            animation: 'scan 2s ease-in-out infinite',
          }}
        />
        <CircularProgress
          size={80}
          value={progress}
          variant={progress ? 'determinate' : 'indeterminate'}
          sx={{
            position: 'absolute',
            top: -8,
            left: -8,
            color: theme.palette.secondary.main,
          }}
        />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
          Escaneando Seguridad
        </Typography>
        {domain && (
          <Typography variant="body1" color="primary" sx={{ mb: 1 }}>
            {domain}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Analizando vulnerabilidades y configuraciones de seguridad...
        </Typography>
        {progress && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {Math.round(progress)}% completado
          </Typography>
        )}
      </Box>
    </Box>
  );
}
