import { Card, CardContent, Box, Typography, Tooltip, Fade } from '@mui/material';
import { ReactNode, useState } from 'react';



// Tipos de estado para manejo cromático inteligente
export type MetricStatus = 'safe' | 'warning' | 'danger' | 'info' | 'neutral';

interface MetricCardProps {
  title: string;
  humanTitle: string; // Título más humanizado para el usuario
  value: string | number;
  description: string; // Descripción corta del estado actual
  status: MetricStatus;
  icon: ReactNode;
  tooltipText: string; // Explicación de qué significa esta métrica
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

// Sistema cromático balanceado basado en la identidad Securyx
const getColorScheme = (status: MetricStatus) => {
  switch (status) {
    case 'safe':
      return {
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #66BB6A 100%)',
        iconColor: '#C8E6C9',
        shadowColor: 'rgba(46, 125, 50, 0.25)',
      };
    case 'warning':
      return {
        background: 'linear-gradient(135deg, #EF6C00 0%, #FF9800 50%, #FFB74D 100%)',
        iconColor: '#FFE0B2',
        shadowColor: 'rgba(239, 108, 0, 0.25)',
      };
    case 'danger':
      return {
        background: 'linear-gradient(135deg, #D32F2F 0%, #EF5350 50%, #FFAB91 100%)',
        iconColor: '#FFCDD2',
        shadowColor: 'rgba(211, 47, 47, 0.25)',
      };
    case 'info':
      return {
        background: 'linear-gradient(135deg, #0288D1 0%, #00B8D9 50%, #4FC3F7 100%)',
        iconColor: '#B3E5FC',
        shadowColor: 'rgba(2, 136, 209, 0.25)',
      };
    default: // neutral
      return {
        background: 'linear-gradient(135deg, #263238 0%, #37474F 50%, #455A64 100%)',
        iconColor: '#B0BEC5',
        shadowColor: 'rgba(38, 50, 56, 0.25)',
      };
  }
};

export function MetricCard({ 
  title,
  humanTitle,
  value, 
  description,
  status,
  icon, 
  tooltipText,
  trend,
  onClick
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colorScheme = getColorScheme(status);

  return (
    <Tooltip 
      title={tooltipText} 
      arrow 
      placement="top"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <Card 
        sx={{ 
          background: colorScheme.background,
          color: 'white',
          cursor: onClick ? 'pointer' : 'default',
          borderRadius: 3,
          overflow: 'visible',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px ${colorScheme.shadowColor}`,
          '&:hover': {
            transform: onClick ? 'translateY(-4px) scale(1.01)' : 'translateY(-2px)',
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.2), 0 3px 8px ${colorScheme.shadowColor}`,
            '& .metric-icon': {
              transform: 'rotate(5deg) scale(1.1)',
            },
            '& .hover-accent': {
              opacity: 1,
              transform: 'scaleX(1)',
            },
          },
          '& .hover-accent': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: '#AEEA00',
            borderRadius: '12px 12px 0 0',
            opacity: 0,
            transform: 'scaleX(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Línea verde de hover animada */}
        <Box className="hover-accent" />
        
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          {/* Header con ícono y título */}
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5}>
            <Box flex={1}>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.75,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'block',
                  mb: 0.8
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  lineHeight: 1.2,
                  color: 'white',
                }}
              >
                {humanTitle}
              </Typography>
            </Box>
            
            <Box 
              className="metric-icon"
              sx={{ 
                fontSize: 20,
                color: colorScheme.iconColor,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                minWidth: 24,
                '& .MuiSvgIcon-root': {
                  fontSize: 20
                }
              }}
            >
              {icon}
            </Box>
          </Box>

          {/* Valor principal con animación */}
          <Box mb={2}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: '2.5rem',
                lineHeight: 1,
                color: 'white',

                textShadow: '0 2px 6px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em',
                transition: 'all 0.2s ease-out'
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* Descripción del estado */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              opacity: 0.9,
              mb: trend ? 1.5 : 0
            }}
          >
            {description}
          </Typography>

          {/* Trend opcional */}
          {trend && (
            <Box 
              display="flex" 
              alignItems="center" 
              mt={1}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                width: 'fit-content'
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: trend.isPositive ? '#A5D6A7' : '#FFCDD2'
                }}
              >
                <Box component="span" sx={{ fontSize: '0.9rem' }}>
                  {trend.isPositive ? '↗' : '↘'}
                </Box>
                {Math.abs(trend.value)}% vs mes anterior
              </Typography>
            </Box>
          )}

          {/* Indicador de estado activo */}
          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#AEEA00',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(174, 234, 0, 0.7)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(174, 234, 0, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(174, 234, 0, 0)',
                  },
                },
              }}
            />
          )}
        </CardContent>
      </Card>
    </Tooltip>
  );
}
