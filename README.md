# Abacus

## Development

> NOTE that for this to work, the user you use to log into Keycloak with
> must have been granted the `view-clients` and `view-users` roles in the Keycloak realm

To host Abacus on a different root URL, modify `PUBLIC_URL` in <projectroot>/.env

### OpenAPI

Generate TypeScript types from OpenAPI specifications
reference https://github.com/drwpow/openapi-typescript

```shell
npx openapi-typescript ../../service_attribute_authority/openapi.json --output src/attributes.ts
npx openapi-typescript ../../service_entitlement/openapi.json --output src/entitlement.ts
```

Keycloak  
reference https://github.com/ccouzens/keycloak-openapi

```shell
npx openapi-typescript https://raw.githubusercontent.com/ccouzens/keycloak-openapi/main/keycloak/15.0.json --output src/service/keycloak.ts
```
