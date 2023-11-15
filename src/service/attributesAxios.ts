import axios from 'axios';
import { ATTRIBUTES_PATH } from "../config";

const attributesClient = () => {
  const instance = axios.create({
    baseURL: ATTRIBUTES_PATH,
  });

  instance.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem('keycloak');
    config.headers.setAuthorization(`Bearer ${token}`)
    config.headers.setAccept('application/json')
    return config;
  });

  return instance;
};

export default attributesClient();
