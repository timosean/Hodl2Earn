import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OverlayProvider } from 'overlay-kit';

import App from './App';
import './global.scss';

const container = document.getElementById('root');

if (!container) {
  throw new Error('React 루트 요소를 찾을 수 없습니다.');
}

createRoot(container).render(
  <StrictMode>
    <OverlayProvider>
      <App />
    </OverlayProvider>
  </StrictMode>,
);
