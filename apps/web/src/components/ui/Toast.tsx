import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  SlideProps,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  type: ToastType;
  title?: string;
  message: string;
  autoHideDuration?: number;
}

const toastConfig = {
  success: {
    icon: <CheckCircle />,
    severity: 'success' as const,
    defaultTitle: '¡Éxito!',
  },
  warning: {
    icon: <Warning />,
    severity: 'warning' as const,
    defaultTitle: 'Atención',
  },
  error: {
    icon: <Error />,
    severity: 'error' as const,
    defaultTitle: 'Error',
  },
  info: {
    icon: <Info />,
    severity: 'info' as const,
    defaultTitle: 'Información',
  },
};

export function Toast({
  open,
  onClose,
  type,
  title,
  message,
  autoHideDuration = 6000,
}: ToastProps) {
  const config = toastConfig[type];

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={TransitionUp}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiAlert-root': {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid',
          borderColor: `${config.severity}.light`,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={config.severity}
        variant="filled"
        icon={config.icon}
        sx={{
          minWidth: 300,
          maxWidth: 500,
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 600 }}>
            {title}
          </AlertTitle>
        )}
        {message}
      </Alert>
    </Snackbar>
  );
}

// Hook para usar toast fácilmente
export function useToast() {
  const [toastState, setToastState] = React.useState<{
    open: boolean;
    type: ToastType;
    title?: string;
    message: string;
  }>({
    open: false,
    type: 'info',
    message: '',
  });

  const showToast = React.useCallback((
    type: ToastType,
    message: string,
    title?: string
  ) => {
    setToastState({
      open: true,
      type,
      title: title || toastConfig[type].defaultTitle,
      message,
    });
  }, []);

  const hideToast = React.useCallback(() => {
    setToastState(prev => ({ ...prev, open: false }));
  }, []);

  const showSuccess = React.useCallback((message: string, title?: string) => {
    showToast('success', message, title);
  }, [showToast]);

  const showError = React.useCallback((message: string, title?: string) => {
    showToast('error', message, title);
  }, [showToast]);

  const showWarning = React.useCallback((message: string, title?: string) => {
    showToast('warning', message, title);
  }, [showToast]);

  const showInfo = React.useCallback((message: string, title?: string) => {
    showToast('info', message, title);
  }, [showToast]);

  return {
    ...toastState,
    hideToast,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
