import axios from 'axios';
import { HOST, PORT } from './config';
axios.defaults.adapter = require('axios/lib/adapters/http');
axios.defaults.baseURL = `http://${HOST}:${PORT}`;

export default axios;
