# Abacus

## Development

### Backend

Run the Quickstart to bring up service on http://localhost:65432

See [Quickstart](https://github.com/opentdf/opentdf/tree/main/quickstart)

### Server (development)

Starts server on http://localhost:3000  
```shell
npm run start
````

### Server (production-like)

```shell
docker run -p 3000:80 \
  -e KEYCLOAK_HOST="http://localhost/auth/" \
  -e KEYCLOAK_CLIENT_ID="localhost-abacus" \
  -e KEYCLOAK_REALMS="opentdf-realms" \
  -e ATTRIBUTES_HOST="http://localhost/v2/attributes" \
  -e ENTITLEMENTS_HOST="http://localhost/v2/entitlements" \
  -e SERVER_BASE_PATH="" \
  $(docker build -q .)
```
Input Format : 
KEYCLOAK_REALMS="item1,item2,item3"

SERVER_BASE_PATH - for abacus relative path support , 
example : SERVER_BASE_PATH="/abacus"



The environment variables becomes `window.__SERVER_DATA__` via an NGINX sub_filter defined in nginx-default.conf

### OpenAPI

Generate TypeScript types from OpenAPI specifications  
reference https://github.com/drwpow/openapi-typescript

```shell
npx openapi-typescript ../backend/containers/attributes/openapi.json --output src/attributes.ts
npx openapi-typescript ../backend/containers/entitlements/openapi.json --output src/entitlement.ts
```

Keycloak  
reference https://github.com/ccouzens/keycloak-openapi

```shell
npx openapi-typescript https://raw.githubusercontent.com/ccouzens/keycloak-openapi/main/keycloak/15.0.json --output src/service/keycloak.ts
```

### Build and deploy

```shell
docker build --tag opentdf/abacus .
docker tag opentdf/abacus opentdf/abacus:0.2.0
docker push opentdf/abacus:0.2.0 
```

### Test

#### react-scripts test
`npm run test`

#### Playwright Test

To install  
`npx playwright install` 

To run (while development server above is running)  
`npm run test:playwright`

### Lint
`CI=true npm run build`


## Design

The `REACT_APP_SERVER_DATA` environment variable becomes `window.__SERVER_DATA__`.
