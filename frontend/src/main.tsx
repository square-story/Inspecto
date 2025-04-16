import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import './index.css'
import App from './App.tsx'
import { store } from '@/store';
import { ThemeProvider } from "./components/ui/theme-provider.tsx"
import { Toaster } from 'sonner';
import ConfirmDialogProvider from './provider/confirm-dialog-provider.tsx';
import { SocketProvider } from './contexts/SocketContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <ConfirmDialogProvider>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SocketProvider>
        <NotificationProvider>
          <App />
        <Toaster richColors />
        </NotificationProvider>
      </SocketProvider>
      </ThemeProvider>
    </Provider>
  </ConfirmDialogProvider>
)
