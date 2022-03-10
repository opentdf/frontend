ARG NODE_VERSION=lts
# multi-stage build

# depender - get production dependencies
FROM node:${NODE_VERSION} as depender
WORKDIR /build/
ENV NODE_OPTIONS "--max-old-space-size=4096"
COPY package-lock.json package.json tdf3-js-4.1.8.tgz ./
RUN npm ci

# builder - create-react-app build
FROM depender as builder
WORKDIR /build/
COPY public/ public/
COPY build/ build/
COPY src/ src/
COPY tsconfig.json/ .

# server - nginx alpine
FROM nginx:stable-alpine as server
COPY --from=builder /build/build /usr/share/nginx/html
COPY nginx-default.conf /etc/nginx/templates/default.conf.template
ENV KEYCLOAK_HOST "http://localhost/keycloak/auth"
ENV KEYCLOAK_CLIENT_ID ""
ENV KEYCLOAK_REALM ""
ENV ATTRIBUTES_HOST "http://localhost/attributes"
ENV ENTITLEMENTS_HOST "http://localhost/entitlements"

EXPOSE 80
