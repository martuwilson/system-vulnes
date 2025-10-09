import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import { CheckCircle, Https, Email, NetworkCheck, BugReport, Warning, ArrowRight, ShowChart } from '@mui/icons-material';

export function HowItWorksSection() {
  return (
    <Box 
      id="como-funciona"
      sx={{ 
        py: 12, 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#3b82f6',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              mb: 2
            }}
          >
            Proceso Simplificado
          </Typography>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #1E2A38 0%, #00B8D9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Cómo Protegemos Tu Negocio
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Tranquilidad en 3 pasos, sin conocimientos técnicos
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="stretch">
          {/* Step 1 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                p: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(30, 42, 56, 0.15)',
                  borderColor: 'rgba(30, 42, 56, 0.2)',
                  '& .step-number': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 12px 32px rgba(30, 42, 56, 0.4)'
                  }
                }
              }}
            >
              {/* Background Decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(135deg, rgba(30, 42, 56, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />

              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box 
                  className="step-number"
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1E2A38 0%, #334155 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(30, 42, 56, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'white' }}>1</Typography>
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Agregás Tu Sitio Web
                </Typography>
                
                <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Solo necesitás poner la dirección de tu página web. En 30 segundos está listo, sin instalar nada.
                </Typography>

                {/* Example URLs */}
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(59, 130, 246, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)'
                    }}
                  />
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600 }}>
                        tuempresa.com.ar
                      </Typography>
                      <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600 }}>
                        tienda.tuempresa.com
                      </Typography>
                      <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600 }}>
                        mail.tuempresa.com
                      </Typography>
                      <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Step 2 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                p: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0, 184, 217, 0.15)',
                  borderColor: 'rgba(0, 184, 217, 0.2)',
                  '& .step-number': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 12px 32px rgba(0, 184, 217, 0.4)'
                  }
                }
              }}
            >
              {/* Background Decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(135deg, rgba(0, 184, 217, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />

              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box 
                  className="step-number"
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #00B8D9 0%, #0891b2 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(0, 184, 217, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'white' }}>2</Typography>
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Revisamos Todo por Vos
                </Typography>
                
                <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Nuestro sistema busca problemas de seguridad las 24 horas. Como tener un guardia digital que nunca duerme.
                </Typography>

                {/* Security Badges */}
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(0, 184, 217, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(0, 184, 217, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 184, 217, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Https sx={{ color: '#00B8D9', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Certificados
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(174, 234, 0, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(174, 234, 0, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(174, 234, 0, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Email sx={{ color: '#AEEA00', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Emails
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(0, 184, 217, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(0, 184, 217, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 184, 217, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <NetworkCheck sx={{ color: '#00B8D9', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Conexiones
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(30, 42, 56, 0.1)', 
                        borderRadius: 2,
                        border: '1px solid rgba(30, 42, 56, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(30, 42, 56, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <BugReport sx={{ color: '#1E2A38', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Vulnerab.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* Step 3 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
                p: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(174, 234, 0, 0.15)',
                  borderColor: 'rgba(174, 234, 0, 0.2)',
                  '& .step-number': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 12px 32px rgba(174, 234, 0, 0.4)'
                  }
                }
              }}
            >
              {/* Background Decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(135deg, rgba(174, 234, 0, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />

              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box 
                  className="step-number"
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #AEEA00 0%, #9ED600 100%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    boxShadow: '0 8px 32px rgba(174, 234, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#1E2A38' }}>3</Typography>
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Te Decimos Qué Hacer
                </Typography>
                
                <Typography sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Recibís un reporte claro con pasos específicos para proteger tu empresa. En español, sin complicaciones.
                </Typography>

                {/* Alert Example */}
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(174, 234, 0, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid rgba(174, 234, 0, 0.2)',
                    position: 'relative',
                    textAlign: 'left'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Warning sx={{ color: '#f59e0b', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      SSL vence en 7 días
                    </Typography>
                  </Box>
                  
                  <Box sx={{ pl: 3, borderLeft: '2px solid #AEEA00' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      <strong>Qué tenés que hacer:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <ArrowRight sx={{ color: '#AEEA00', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: '#1E2A38', fontWeight: 600 }}>
                        Llamar a tu empresa de hosting
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ArrowRight sx={{ color: '#AEEA00', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: '#1E2A38', fontWeight: 600 }}>
                        Te mandamos los pasos exactos
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* ROI Guarantee Section */}
        <Box sx={{ mt: 12 }}>
          <Box 
            sx={{ 
              textAlign: 'center',
              p: 6,
              background: 'linear-gradient(135deg, #1E2A38 0%, #334155 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(30, 42, 56, 0.3)'
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 20%, rgba(174, 234, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 184, 217, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
              }}
            />

            <Box sx={{ position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                <ShowChart sx={{ fontSize: 40, color: '#AEEA00' }} />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Garantía de Resultados
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 500, color: '#AEEA00' }}>
                Si no encontramos al menos 3 problemas de seguridad en tu sitio web, te devolvemos el dinero.
              </Typography>
              
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
                Más del 90% de las PyMEs tienen vulnerabilidades que no conocen. Probablemente vos también.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
