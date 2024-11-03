import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Dashboard from './dashboard/Dashboard';
import reportWebVitals from './reportWebVitals';

import client from './providers/apolloClient';
import { ApolloProvider } from '@apollo/client';
import { Buffer } from 'buffer';
import 'stream-browserify';
import 'crypto-browserify'; // Import crypto-browserify

import { WalletProvider } from './providers/walletContext';

// Make Buffer available globally
window.Buffer = Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WalletProvider>
      <ApolloProvider client={client}>
        <Dashboard />
      </ApolloProvider>
    </WalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
