{{- define "ferristrace-website.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "ferristrace-website.fullname" -}}
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

{{- define "ferristrace-website.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{ include "ferristrace-website.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: ferristrace
{{- end }}

{{- define "ferristrace-website.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ferristrace-website.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "ferristrace-website.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "ferristrace-website.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "ferristrace-website.image" -}}
{{- if not .Values.image.tag }}
{{- fail "image.tag is required: pin an immutable tag such as sha-<commit>" }}
{{- end }}
{{- if eq .Values.image.tag "latest" }}
{{- fail "image.tag must not be 'latest'" }}
{{- end }}
{{- printf "%s:%s" .Values.image.repository .Values.image.tag }}
{{- end }}
