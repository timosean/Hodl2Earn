import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OverlayProvider } from 'overlay-kit';

import App from './App';
import './global.scss';
import { isComponentBookRoute } from './routing';

const container = document.getElementById('root');

if (!container) {
  throw new Error('React 루트 요소를 찾을 수 없습니다.');
}

const root = createRoot(container);

async function renderApplication() {
  let application = <App />;

  if (__DEV__ && isComponentBookRoute(window.location.pathname, true)) {
    const { ComponentBook } = await import('./componentBook');
    application = <ComponentBook />;
  }

  root.render(
    <StrictMode>
      <OverlayProvider>{application}</OverlayProvider>
    </StrictMode>,
  );
}

void renderApplication();
