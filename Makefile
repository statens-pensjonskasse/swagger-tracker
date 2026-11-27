# Script tracks API on swaggerhub, updating desired version and downloading specs for that version.
# make.properties holds the properties you need to tailor
#
#   make renovate      Set SWAG_DESIRED_VERSION (in make.properties) to latest version on registry, then install
#   make update        = renovate
#   make install       Download SWAG_DESIRED_VERSION of the OpenAPI spec (skipped if already downloaded)
#
# Requires bash, curl and jq (preinstalled on GitHub ubuntu runners; jq ships with macOS 15+).

# This file, for help; must be set before any include
SWAG_MAKEFILE := $(lastword $(MAKEFILE_LIST))
SHELL := /bin/bash

# Settings file, rewritten by `make renovate`
SWAG_PROPERTIES ?= make.properties
ifeq ($(wildcard $(SWAG_PROPERTIES)),)
$(error Missing settings file $(SWAG_PROPERTIES))
endif
include $(SWAG_PROPERTIES)

.PHONY: help install renovate update api-version

# Common preamble: strict mode, tool check, settings as shell variables
SWAG_PRE = set -euo pipefail; \
	for tool in curl jq; do command -v "$$tool" >/dev/null || { echo "$$tool is required" >&2; exit 1; }; done; \
	registry='$(SWAG_REGISTRY)'; \
	desired='$(SWAG_DESIRED_VERSION)'; \
	local_json='$(SWAG_LOCAL_JSON)'; \
	local_yaml='$(SWAG_LOCAL_YAML)'; \
	for v in registry desired local_json local_yaml; do [ -n "$${!v}" ] || { echo "Missing setting: $$v" >&2; exit 1; }; done; \
	tmp=""; trap '[ -z "$$tmp" ] || rm -f "$$tmp"' EXIT

# Updates SWAG_DESIRED_VERSION in make.properties (and $$desired) to defaultVersion on registry
SWAG_RENOVATE = \
	latest=$$(curl -fsSL "$$registry" | jq -r '.defaultVersion // empty'); \
	[ -n "$$latest" ] || { echo "SwaggerHub response did not include a default version" >&2; exit 1; }; \
	if [ "$$desired" = "$$latest" ]; then \
		echo "SWAG_DESIRED_VERSION not updated, $$desired is latest found on $$registry"; \
	else \
		tmp="$(SWAG_PROPERTIES).tmp"; \
		sed "s|^SWAG_DESIRED_VERSION *=.*|SWAG_DESIRED_VERSION=$$latest|" '$(SWAG_PROPERTIES)' > "$$tmp"; \
		cat "$$tmp" > '$(SWAG_PROPERTIES)'; rm -f "$$tmp"; \
		desired="$$latest"; \
		echo "SWAG_DESIRED_VERSION updated to $$latest in $(SWAG_PROPERTIES)"; \
	fi

# Downloads yaml and json spec of $$desired, unless json already has that version
SWAG_INSTALL = \
	actual=""; \
	[ -f "$$local_json" ] && actual=$$(jq -r '.info.version // empty' "$$local_json"); \
	if [ "$$actual" = "$$desired" ]; then \
		echo "API spec not updated. Current version: $$actual, Desired version: $$desired"; exit 0; \
	fi; \
	echo "Updating API spec to version $$desired"; \
	api_url=$$(curl -fsSL "$$registry" | jq -r --arg v "$$desired" \
		'first(.apis[]? | select(any(.properties[]?; .type == "X-Version" and .value == $$v)) \
		| .properties[]? | select(.type == "Swagger") | .url) // empty'); \
	[ -n "$$api_url" ] || { echo "Version $$desired not found on $$registry" >&2; exit 1; }; \
	tmp="$$local_yaml.tmp"; \
	curl -fsSL "$$api_url/swagger.yaml" > "$$tmp"; mv "$$tmp" "$$local_yaml"; \
	echo "$$api_url/swagger.yaml downloaded to $$local_yaml"; \
	tmp="$$local_json.tmp"; \
	curl -fsSL "$$api_url" | jq . > "$$tmp"; mv "$$tmp" "$$local_json"; \
	echo "$$api_url downloaded to $$local_json"


help:
	@sed -n '1,/^$$/p' '$(SWAG_MAKEFILE)'

install:
	@$(SWAG_PRE); $(SWAG_INSTALL)

renovate update:
	@$(SWAG_PRE); $(SWAG_RENOVATE); $(SWAG_INSTALL)

api-version:
	@if [ -f '$(SWAG_LOCAL_JSON)' ]; then jq -r '.info.version // "null"' '$(SWAG_LOCAL_JSON)'; else echo null; fi
