import { Card, CardContent, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient,
  trend,
  onClick 
}: MetricCardProps) {
  return (
    <Card 
      sx={{ 
        background: gradient,
        color: 'white',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {trend.isPositive ? '↗️' : '↘️'}
                  {Math.abs(trend.value)}% vs mes anterior
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ fontSize: 48, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
