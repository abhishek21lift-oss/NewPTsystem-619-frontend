import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(18,18,20,0.97)',
            color: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '13px',
            backdropFilter: 'blur(20px)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
