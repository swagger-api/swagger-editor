import React from 'react';
import { createRoot } from 'react-dom/client';
import 'swagger-ui-react/swagger-ui.css';

import SwaggerEditor from './App';

const root = createRoot(document.getElementById('swagger-editor') as HTMLElement);

// Render the app - Playwright tests need the app to auto-render
root.render(<SwaggerEditor queryConfigEnabled />);
