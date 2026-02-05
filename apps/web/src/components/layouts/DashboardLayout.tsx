import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Business,
  Settings,
  Logout,
  Shield,
  Notifications,
  Person,
  Home,
  Radar,
  Security,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 260;

const menuItems = [
  {
    text: 'Inicio',
    icon: <Home />,
    path: '/app/dashboard',
    description: 'Resumen de tu seguridad',
  },
  {
    text: 'Mi Empresa',
    icon: <Business />,
    path: '/app/companies',
    description: 'Datos de tu negocio',
  },
  {
    text: 'Monitoreo',
    icon: <Radar />,
    path: '/app/scans',
    description: 'Estado de protección',
  },
  {
    text: 'Alertas de Seguridad',
    icon: <Security />,
    path: '/app/findings',
    description: 'Problemas detectados',
  },
  {
    text: 'Configuración',
    icon: <Settings />,
    path: '/app/settings',
    description: 'Ajustes del sistema',
  },
];

export function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/auth/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del sidebar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2.5,
          background: 'linear-gradient(135deg, #1E2A38 0%, #2A3A4A 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderBottom: '2px solid #AEEA00',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Shield sx={{ mr: 1.5, fontSize: 24, color: '#AEEA00' }} />
          <Box>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                lineHeight: 1.2,
                color: '#FFFFFF',
                fontSize: '1.1rem',
              }}
            >
              Securyx
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                color: '#AEEA00',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              PYME EDITION
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Perfil del usuario */}
      <Box sx={{ p: 2.5, textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 1.5,
            bgcolor: '#1E2A38',
            fontSize: '1.3rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {user?.firstName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5, color: '#1E2A38' }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          {user?.email}
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.4,
            borderRadius: 1.5,
            backgroundColor: '#E8F5E8',
            color: '#2E7D32',
            border: '1px solid #A5D6A7',
          }}
        >
          <Person sx={{ fontSize: 14, mr: 0.5 }} />
          <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.7rem' }}>
            Administrador
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navegación principal */}
      <Box sx={{ flex: 1, p: 1.5 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            py: 1, 
            display: 'block',
            fontWeight: 700,
            color: '#1E2A38',
            letterSpacing: 1.2,
            fontSize: '0.7rem',
          }}
        >
          MENÚ PRINCIPAL
        </Typography>
        <List sx={{ mt: 0.5 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 1.5,
                    backgroundColor: isActive ? '#1E2A38' : 'transparent',
                    color: isActive ? 'white' : '#1E2A38',
                    boxShadow: isActive ? '0 3px 10px rgba(30, 42, 56, 0.2)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    border: isActive ? 'none' : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? '#2A3A4A' 
                        : '#F0F4F8',
                      transform: 'translateX(4px)',
                      boxShadow: isActive 
                        ? '0 4px 14px rgba(30, 42, 56, 0.25)' 
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      border: isActive ? 'none' : '1px solid #E2E8F0',
                    },
                    // Accent line for active item
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      backgroundColor: '#AEEA00',
                      borderRadius: '0 2px 2px 0',
                    } : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#AEEA00' : '#1E2A38',
                      minWidth: 40,
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: 1.2,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      color: isActive ? 'rgba(255,255,255,0.8)' : '#64748B',
                      lineHeight: 1.3,
                      mt: 0.2,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer del sidebar */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', textAlign: 'center', mb: 1 }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Título de la página actual */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5, color: '#1E2A38' }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Inicio'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {menuItems.find(item => item.path === location.pathname)?.description || 'Resumen de tu seguridad'}
            </Typography>
          </Box>

          {/* Botón para ir al Home/Landing */}
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
            title="Ir al inicio"
          >
            <Shield sx={{ fontSize: 24 }} />
          </IconButton>

          {/* Notificaciones mejoradas */}
          <IconButton 
            color="inherit" 
            sx={{ 
              mr: 2,
              position: 'relative',
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            <Badge 
              badgeContent={3} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Notifications sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>

          {/* Perfil del usuario mejorado */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              px: 2,
              py: 1,
              borderRadius: 3,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 1.5,
                bgcolor: theme.palette.primary.main,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrador
              </Typography>
            </Box>
          </Box>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0',
                minWidth: 200,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" fontWeight="600">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <MenuItem 
              onClick={() => { handleMenuClose(); navigate('/app/profile'); }}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Ver Perfil
            </MenuItem>
            <MenuItem 
              onClick={() => { handleMenuClose(); navigate('/settings'); }}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configuración
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: '#dc2626',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                },
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#dc2626' }} />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '80px', // Increased to accommodate larger header
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 80px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '0 0 32px 32px',
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
