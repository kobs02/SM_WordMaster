import React from 'react';
import ReactDOM from 'react-dom/client';  // `react-dom`에서 `createRoot`를 가져옵니다.
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);