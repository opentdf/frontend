load("ext://helm_resource", "helm_resource", "helm_repo")
load("ext://min_tilt_version", "min_tilt_version")


# Versions of things backend to pull (attributes, kas, etc)
BACKEND_CHART_TAG = os.environ.get("BACKEND_LATEST_VERSION", "1.4.2")

# Where helm values for quickstart
HELM_VALUES_PATH = os.getenv("OPENTDF_HELM_VALUES_PATH", "helm/")

# Where the redirect URI should go to, for example
EXTERNAL_URL = os.getenv("OPENTDF_EXTERNAL_URL", "http://localhost:65432")

# Ingress host port
INGRESS_HOST_PORT = os.getenv("OPENTDF_INGRESS_HOST_PORT", "65432")

k8s_yaml(
    helm(
        "./helm/secrets",
    ),
)

helm_repo(
    "bitnami-archive",
    "https://raw.githubusercontent.com/bitnami/charts/archive-full-index/bitnami",
    labels="utility",
)
helm_repo(
    "codecentric",
    "https://codecentric.github.io/helm-charts",
    labels="utility",
)
helm_repo(
    "k8s-in",
    "https://kubernetes.github.io/ingress-nginx",
    labels="utility",
)

helm_resource(
    "ingress-nginx",
    "k8s-in/ingress-nginx",
    flags=[
        "--version",
        "4.0.16",
        "--set",
        "controller.config.large-client-header-buffers=20 32k",
        "--set",
        "controller.admissionWebhooks.enabled=false",
    ],
    labels="third-party",
    port_forwards=("{}:80".format(INGRESS_HOST_PORT) if INGRESS_HOST_PORT else None),
    resource_deps=["k8s-in"],
)

helm_resource(
    "postgresql",
    "bitnami-archive/postgresql",
    flags=["--version", "12.1.8", "-f", "helm/values-postgresql.yaml"],
    labels="third-party",
    resource_deps=["bitnami-archive"],
)

helm_resource(
    "attributes",
    "oci://ghcr.io/opentdf/charts/attributes",
    flags=[
        "--version",
        BACKEND_CHART_TAG,
        "-f",
        "helm/values-attributes.yaml",
        "--set",
        "oidc.externalHost=%s/auth" % EXTERNAL_URL,
    ],
    labels="backend",
    resource_deps=["postgresql"],
)

helm_resource(
    "entitlement-store",
    "oci://ghcr.io/opentdf/charts/entitlement-store",
    flags=[
        "--version",
        BACKEND_CHART_TAG,
        "-f",
        "helm/values-entitlement-store.yaml",
    ],
    labels="backend",
    resource_deps=["postgresql"],
)

helm_resource(
    "entitlement-pdp",
    "oci://ghcr.io/opentdf/charts/entitlement-pdp",
    flags=[
        "--version",
        BACKEND_CHART_TAG,
        "-f",
        "helm/values-entitlement-pdp.yaml",
    ],
    labels="backend",
    resource_deps=["entitlement-store"],
)

helm_resource(
    "entitlements",
    "oci://ghcr.io/opentdf/charts/entitlements",
    flags=[
        "--version",
        BACKEND_CHART_TAG,
        "-f",
        "helm/values-entitlements.yaml",
        "--set",
        "oidc.authorizationUrl=%s/auth/realms/tdf/protocol/openid-connect/auth"
        % EXTERNAL_URL,
        "--set",
        "oidc.tokenUrl=%s/auth/realms/tdf/protocol/openid-connect/token" % EXTERNAL_URL,
    ],
    labels="backend",
    resource_deps=["postgresql"],
)

helm_resource(
    "keycloak",
    "codecentric/keycloakx",
    flags=[
        "--version",
        "1.6.1",
        "-f",
        "helm/values-keycloak.yaml",
    ],
    labels="third-party",
    resource_deps=["entitlement-pdp", "codecentric"],
)

helm_resource(
    "kas",
    "oci://ghcr.io/opentdf/charts/kas",
    flags=[
        "--version",
        BACKEND_CHART_TAG,
        "-f",
        "helm/values-kas.yaml",
    ],
    labels="backend",
    resource_deps=["attributes", "keycloak"],
)

# ability to disable the quickstart defaults
if not os.environ.get("QUICKSTART_BOOTSTRAP_DISABLED"):
    helm_resource(
        "keycloak-bootstrap",
        "oci://ghcr.io/opentdf/charts/keycloak-bootstrap",
        flags=[
            "--version",
            BACKEND_CHART_TAG,
            "-f",
            "helm/values-keycloak-bootstrap.yaml",
            "--set",
            "externalUrl=%s" % EXTERNAL_URL,
        ],
        labels="utility",
        resource_deps=["attributes", "entitlements", "keycloak"],
    )

local_resource("test", "npm run test", resource_deps=["keycloak-bootstrap"])
