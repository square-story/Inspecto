import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import './index.css'
import App from './App.tsx'
import { store } from '@/store';
import { ThemeProvider } from "./components/ui/theme-provider.tsx"
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </ThemeProvider>
)
