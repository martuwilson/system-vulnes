import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { getHealthScoreTheme } from '../../lib/design-system';

interface HealthScoreIndicatorProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showProgress?: boolean;
}

export function HealthScoreIndicator({ 
  score, 
  size = 'medium', 
  showLabel = true, 
  showProgress = true 
}: HealthScoreIndicatorProps) {
  const theme = getHealthScoreTheme(score);
  
  const progressSize = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  const fontSize = size === 'small' ? '0.875rem' : size === 'medium' ? '1.125rem' : '1.5rem';

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {showProgress && (
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={100}
            size={progressSize}
            thickness={4}
            sx={{
              color: '#f0f0f0',
              position: 'absolute',
            }}
          />
          <CircularProgress
            variant="determinate"
            value={score}
            size={progressSize}
            thickness={4}
            sx={{
              color: theme.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography
              variant="body1"
              component="div"
              fontWeight="bold"
              fontSize={fontSize}
              color={theme.main}
            >
              {score}%
            </Typography>
          </Box>
        </Box>
      )}

      {showLabel && (
        <Box>
          <Chip
            label={theme.label}
            icon={<span style={{ fontSize: '1.2em' }}>{theme.icon}</span>}
            sx={{
              backgroundColor: theme.light,
              color: theme.main,
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                marginLeft: '4px'
              }
            }}
          />
          {!showProgress && (
            <Typography
              variant="h4"
              fontWeight="bold"
              color={theme.main}
              sx={{ mt: 1 }}
            >
              {score}%
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
