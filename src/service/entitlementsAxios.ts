import axios from 'axios';
import { ENTITLEMENTS_PATH } from "../config";

const baseURL = ENTITLEMENTS_PATH;

const entitlementsClient = () => {
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

export default entitlementsClient();
