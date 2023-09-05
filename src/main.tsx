import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseAppProvider } from 'reactfire';
import { BrowserRouter } from 'react-router-dom';
import { firebaseConfig } from './firebase-config.ts';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </FirebaseAppProvider>
  </React.StrictMode>
);
