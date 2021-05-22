import axios from 'axios';

var instance ;

instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
});

instance.interceptors.response.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default instance