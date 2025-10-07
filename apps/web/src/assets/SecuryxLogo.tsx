const SecuryxLogo = ({ width = 200, height = 60, ...props }) => (
  <svg width={width} height={height} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Background with rounded corners */}
    <rect width="200" height="60" rx="8" fill="#2c3e50"/>
    
    {/* Securyx text */}
    <text 
      x="15" 
      y="38" 
      fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
      fontSize="26" 
      fontWeight="700" 
      fill="white"
    >
      Securyx
    </text>
    
    {/* PyME text - positioned close to the 'x' */}
    <text 
      x="155" 
      y="52" 
      fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
      fontSize="13" 
      fontStyle="italic" 
      fontWeight="400" 
      fill="#7fb3d3"
    >
      PyME
    </text>
  </svg>
);

export default SecuryxLogo;
