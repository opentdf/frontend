/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly SERVER_DATA: ServerData
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface ServerData {
    BASE_PATH: string
    CLIENT_ID: string
    REALM: string
    AUTHORITY: string
    KAS_ENDPOINT: string
    ENTITLEMENTS_PATH: string
    ATTRIBUTES_PATH: string
}
