{{/*
Expand the name of the chart.
*/}}
{{- define "abacus.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "abacus.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "abacus.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "abacus.labels" -}}
helm.sh/chart: {{ include "abacus.chart" . }}
{{ include "abacus.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "abacus.selectorLabels" -}}
app.kubernetes.io/name: {{ include "abacus.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "abacus.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "abacus.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create URL to attributes service
*/}}
{{- define "abacus.attributesServerUrl" -}}
{{- if .Values.attributes.serverUrl }}
{{- .Values.attributes.serverUrl }}
{{- else }}
{{- printf "%s://%s%s" .Values.global.opentdf.common.ingress.scheme .Values.global.opentdf.common.ingress.hostname .Values.global.opentdf.common.ingress.attributesPrefix }}
{{- end }}
{{- end }}

{{/*
Create URL to entitlements service
*/}}
{{- define "abacus.entitlementsServerUrl" -}}
{{- if .Values.entitlements.serverUrl  }}
{{- .Values.entitlements.serverUrl  }}
{{- else }}
{{- printf "%s://%s%s" .Values.global.opentdf.common.ingress.scheme .Values.global.opentdf.common.ingress.hostname .Values.global.opentdf.common.ingress.entitlementsPrefix }}
{{- end }}
{{- end }}

{{/*
Create URL to key access service
*/}}
{{- define "abacus.kasServerUrl" -}}
{{- if .Values.kas.serverUrl  }}
{{- .Values.kas.serverUrl  }}
{{- else }}
{{- printf "%s://%s%s" .Values.global.opentdf.common.ingress.scheme .Values.global.opentdf.common.ingress.hostname .Values.global.opentdf.common.ingress.kasPrefix }}
{{- end }}
{{- end }}

{{/*
Create URL to Keycloak Endpoint
*/}}
{{- define "abacus.keycloakServerUrl" -}}
{{- if .Values.oidc.serverUrl }}
{{- .Values.oidc.serverUrl }}
{{- else }}
{{- printf "%s/auth/" .Values.global.opentdf.common.oidcExternalBaseUrl }}
{{- end }}
{{- end }}


