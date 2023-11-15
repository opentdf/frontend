import axios from 'axios';
import { AUTHORITY } from "../config";

const baseURL = AUTHORITY;

const keyCloakClient = () => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem('keycloak');
    config.headers.setAuthorization(`Bearer ${token}`)
    config.headers.setAccept('application/json')
    return config;
  });

  return instance;
};

export default keyCloakClient();
