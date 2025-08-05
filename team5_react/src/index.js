import './index.css';

import App from './App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

axios.defaults.withCredentials = true;

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);