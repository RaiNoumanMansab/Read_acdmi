import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Chart as ChartJS, registerables } from 'chart.js';
import './index.css';
import App from './App.tsx';
import { initCardHoverEffects } from './utils/cardHoverEffects.ts';
import { showAlertModal } from './components/common/ConfirmModal.tsx';

ChartJS.register(...registerables);
initCardHoverEffects();

if (typeof window !== 'undefined') {
  window.alert = (message?: any) => {
    showAlertModal(String(message ?? ''));
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
