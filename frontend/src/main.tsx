import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import './index.css'
import App from './App.tsx'
import { store } from '@/store';
import { ThemeProvider } from "./components/ui/theme-provider.tsx"
import { Toaster } from 'sonner';
import ConfirmDialogProvider from './provider/confirm-dialog-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <ConfirmDialogProvider>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </ConfirmDialogProvider>
)
