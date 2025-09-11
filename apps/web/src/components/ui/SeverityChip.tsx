import { Chip, Box } from '@mui/material';
import { getSeverityColor, getSeverityIcon } from '../../lib/design-system';
import { translateSeverity } from '../../lib/translations';

interface SeverityChipProps {
  severity: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined';
  showIcon?: boolean;
}

export function SeverityChip({ 
  severity, 
  size = 'small', 
  variant = 'filled',
  showIcon = true 
}: SeverityChipProps) {
  const severityColors = getSeverityColor(severity);
  const icon = getSeverityIcon(severity);
  
  const chipStyles = variant === 'filled' ? {
    backgroundColor: severityColors.main,
    color: severityColors.contrastText,
    fontWeight: 'bold',
    '& .MuiChip-icon': {
      color: severityColors.contrastText
    }
  } : {
    borderColor: severityColors.main,
    color: severityColors.main,
    backgroundColor: severityColors.light,
    fontWeight: 'bold',
    '& .MuiChip-icon': {
      color: severityColors.main
    }
  };

  return (
    <Chip
      label={translateSeverity(severity)}
      icon={showIcon ? <Box component="span">{icon}</Box> : undefined}
      size={size}
      variant={variant === 'outlined' ? 'outlined' : 'filled'}
      sx={chipStyles}
    />
  );
}
