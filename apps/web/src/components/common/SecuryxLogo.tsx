const SecuryxLogo = ({ width = 200, height = 60, ...props }) => (
  <svg width={width} height={height} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Gradiente para el fondo */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    
    {/* Fondo sutil con glassmorphism */}
    <rect 
      width="200" 
      height="60" 
      rx="12" 
      fill="url(#logoGradient)"
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth="1"
    />
    
    {/* Icono de escudo de seguridad */}
    <g transform="translate(12, 15)">
      <path
        d="M15 4.5L15 2.5C15 1.67 14.33 1 13.5 1H1.5C0.67 1 0 1.67 0 2.5V4.5C0 8.09 2.91 11 6.5 11H8.5C12.09 11 15 8.09 15 4.5Z"
        fill="url(#textGradient)"
        transform="scale(1.8)"
      />
      <path
        d="M7.5 6.5L6 8L4.5 6.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="scale(1.8) translate(0, -1)"
        fill="none"
      />
    </g>
    
    {/* Securyx text con gradiente */}
    <text 
      x="50" 
      y="38" 
      fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
      fontSize="24" 
      fontWeight="700" 
      fill="url(#textGradient)"
    >
      Securyx
    </text>
    
    {/* PyME text con estilo moderno */}
    <text 
      x="148" 
      y="48" 
      fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
      fontSize="11" 
      fontWeight="500" 
      fill="rgba(255, 255, 255, 0.7)"
      letterSpacing="0.5px"
    >
      PyME
    </text>
    
    {/* Decoración adicional - punto de acento */}
    <circle cx="140" cy="44" r="2" fill="#60a5fa" opacity="0.6" />
  </svg>
);

export default SecuryxLogo;
