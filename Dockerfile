ARG NODE_VERSION=lts
ARG GO_VERSION=latest
# multi-stage build

# depender - get production dependencies
FROM node:${NODE_VERSION} as depender
WORKDIR /build/
COPY package-lock.json package.json ./
RUN npm ci

# builder - create-react-app build
FROM depender as builder
WORKDIR /build/
COPY public/ public/
COPY src/ src/
COPY tests/ tests/
COPY tsconfig.json .
COPY vite.config.ts .
COPY index.html .
ENV VITE_APP_SERVER_BASE_PATH "/"
RUN npm run build

# gobuilder - http server build
FROM golang:${GO_VERSION} as gobuilder
WORKDIR /usr/local/go/src/server/
COPY server/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -v -a  -o /server


FROM gcr.io/distroless/static-debian11 as server
WORKDIR /
COPY --from=gobuilder --chown=root:root --chmod=555 /server /server
# in CI the build out put is build/, locally it is dist/
COPY --chown=root:root --chmod=555 build/ /www/

USER 10001

# uncomment to debug CI builds
#RUN ls -l www
#RUN ls -l www/static
#RUN cat www/index.html
ENV KEYCLOAK_HOST "http://localhost/keycloak/auth"
ENV KEYCLOAK_CLIENT_ID "abacus"
ENV KEYCLOAK_REALMS "tdf"
ENV ATTRIBUTES_HOST "http://localhost/attributes"
ENV ENTITLEMENTS_HOST "http://localhost/entitlements"
ENV KAS_HOST "http://localhost:8000"
ENV SERVER_BASE_PATH ""

EXPOSE 8080
ENTRYPOINT ["/server"]
