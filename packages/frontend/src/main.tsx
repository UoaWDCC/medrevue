import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './redux/store.ts';
import { applySavedTheme } from './utils/theme.ts';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

if (!location.pathname.startsWith('/admin')) applySavedTheme();

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
