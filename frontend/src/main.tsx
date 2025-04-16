// import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast'; // Import the ToastProvider
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
// turns out vibe code wasn't the problem
//   <React.StrictMode>
    <HashRouter>
        <ToastProvider> {/* Wrap your app with ToastProvider */}
            <App />
        </ToastProvider>
    </HashRouter>
//   </React.StrictMode>
);
