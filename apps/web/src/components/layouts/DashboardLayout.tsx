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
  Insights,
  Scanner,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Insights />,
    path: '/app/dashboard',
    description: 'Resumen general de seguridad',
  },
  {
    text: 'Empresas',
    icon: <Business />,
    path: '/app/companies',
    description: 'Gestión de empresas',
  },
  {
    text: 'Escaneos',
    icon: <Scanner />,
    path: '/app/scans',
    description: 'Historial de escaneos',
  },
  {
    text: 'Vulnerabilidades',
    icon: <Warning />,
    path: '/app/findings',
    description: 'Problemas encontrados',
  },
  {
    text: 'Configuración',
    icon: <Settings />,
    path: '/app/settings',
    description: 'Configurar sistema',
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
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Shield sx={{ mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            Security System
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            PYME Edition
          </Typography>
        </Box>
      </Box>
      
      {/* Perfil del usuario */}
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8fafc' }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
            bgcolor: theme.palette.primary.main,
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {user?.firstName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
          {user?.firstName?.charAt(0).toUpperCase()}.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {user?.email}
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
          }}
        >
          <Person sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption" fontWeight="600">
            Admin
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navegación principal */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 2, 
            py: 1, 
            display: 'block',
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: 1,
          }}
        >
          Navegación
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                    color: isActive ? 'white' : 'inherit',
                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? theme.palette.primary.dark 
                        : '#f1f5f9',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                    },
                    // Badge indicator for active item
                    '&::after': isActive ? {
                      content: '""',
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 20,
                      backgroundColor: 'white',
                      borderRadius: 2,
                    } : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : theme.palette.primary.main,
                      minWidth: 44,
                      '& .MuiSvgIcon-root': {
                        fontSize: 22,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    secondary={!isActive ? item.description : undefined}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: isActive ? 'rgba(255,255,255,0.7)' : 'text.secondary',
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
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid #e2e8f0',
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
            <Typography variant="h5" fontWeight="600" sx={{ mb: 0.5 }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {menuItems.find(item => item.path === location.pathname)?.description || 'Resumen general de seguridad'}
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
              onClick={handleMenuClose}
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
