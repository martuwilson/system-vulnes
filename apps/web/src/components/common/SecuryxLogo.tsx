import React from 'react';
import secLogoImg from '../../assets/sec_logo-removebg.png';

interface SecuryxLogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const SecuryxLogo: React.FC<SecuryxLogoProps> = ({ 
  width = 200, 
  height = 60, 
  className,
  style,
  onClick,
  ...props 
}) => (
  <img 
    src={secLogoImg} 
    alt="Securyx PyME - Protección Digital"
    width={width}
    height={height}
    className={className}
    style={{
      objectFit: 'contain',
      ...style
    }}
    onClick={onClick}
    {...props}
  />
);

export default SecuryxLogo;
