import axios_base from 'axios';
import { environment } from '../environments/environment';

export const axios = axios_base.create({
    baseURL: environment.production ? undefined : 'http://127.0.0.1:3000',
    withCredentials: true,
})

// axios.defaults.withCredentials = true;
// probably not need on frontend
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'localhost:3000';
// axios.defaults.headers.get['Access-Control-Allow-Origin'] = 'localhost:3000';