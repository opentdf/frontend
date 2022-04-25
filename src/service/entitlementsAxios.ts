import axios from 'axios';
import { ENTITLEMENTS_PATH } from "../config";

const baseURL = ENTITLEMENTS_PATH;

const entitlementsClient = () => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem('keycloak');

    config.headers = {
      ...config.headers,
      authorization: `Bearer ${token}`,
      accept: 'application/json',
      "Access-Control-Allow-Origin": "http://localhost:3000"
    };

    return config;
  });

  return instance;
};

export default entitlementsClient();
