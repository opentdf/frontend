console.log(import.meta.env);
console.log(import.meta.env.VITE_APP_TITLE);
console.log(import.meta.env.VITE_SERVER_DATA);
const serverData = import.meta.env.VITE_SERVER_DATA;
console.log(typeof serverData);
let realm = localStorage.getItem("realm");
console.log(serverData.realms);

export const BASE_PATH = serverData.basePath;
export const CLIENT_ID = serverData.clientId;
export const REALM = realm;
export const AUTHORITY = serverData.authority;
export const KAS_ENDPOINT = serverData.access;
export const ENTITLEMENTS_PATH = serverData.entitlements;
export const ATTRIBUTES_PATH = serverData.attributes;

export const keycloakConfig = {
    url: AUTHORITY,
    clientId: CLIENT_ID, realm: ""

};


