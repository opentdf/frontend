import axios from 'axios';
import { CLAIMS_PATH } from "../config";

const claimsClient = () => {
  const instance = axios.create({
    baseURL: CLAIMS_PATH,
  });

  instance.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem('keycloak');

    config.headers = {
      ...config.headers,
      authorization: `Bearer ${token}`,
      accept: 'application/json'
    };

    return config;
  });

  return instance;
};

export default claimsClient();
