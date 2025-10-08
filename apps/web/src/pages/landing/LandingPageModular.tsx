import { Box } from '@mui/material';
import { Navbar, HeroSection, HowItWorksSection, FeaturesSection, PlaceholderSection } from '../../components/landing';

export function LandingPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Altura aproximada del navbar
      const elementPosition = element.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box>
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      
      <Navbar onNavigate={scrollToSection} />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      
      {/* Placeholder sections - to be replaced with actual components */}
      <PlaceholderSection 
        id="tipos-escaneos"
        title="Tipos de Escaneos"
        subtitle="Cobertura completa de vectores de ataque comunes"
        background="#ffffff"
      />
      <PlaceholderSection 
        id="testimonials"
        title="Testimonios"
        subtitle="Lo que dicen nuestros clientes"
        background="#f8fafc"
      />
      <PlaceholderSection 
        id="precios"
        title="Precios"
        subtitle="Planes diseñados para PyMEs"
        background="#0a0e27"
      />
      <PlaceholderSection 
        id="faq"
        title="FAQ"
        subtitle="Preguntas frecuentes"
        background="#f8fafc"
      />
    </Box>
  );
}
