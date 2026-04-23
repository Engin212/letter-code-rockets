#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${REPO_ROOT}/.env.deploy"

[ -f "${ENV_FILE}" ] && { set -a; source "${ENV_FILE}"; set +a; }

MSG="see .env.deploy.example"
: "${DEPLOY_USER:?${MSG}}"
: "${DEPLOY_HOST:?${MSG}}"
: "${DEPLOY_PATH:?${MSG}}"
: "${DEPLOY_URL:?${MSG}}"

[[ "${DEPLOY_PATH}" =~ ^/[A-Za-z0-9/_.@+-]+$ && "${DEPLOY_PATH}" != *".."* ]] || {
  echo "FAIL: DEPLOY_PATH must be an absolute path using only letters, digits, and / _ . - @ + (no '..' segments): '${DEPLOY_PATH}'" >&2
  exit 1
}

cd "${REPO_ROOT}"

# Safety gate: refuse to deploy unless the target dir is marked as a
# deploy target on the remote. Without this, a typo in DEPLOY_PATH could
# let rsync --delete wipe the wrong directory.
ssh -o BatchMode=yes "${DEPLOY_USER}@${DEPLOY_HOST}" \
    "test -f '${DEPLOY_PATH}/.deploy-marker'" 2>/dev/null || {
  echo "FAIL: ${DEPLOY_PATH}/.deploy-marker missing (or SSH unreachable)." >&2
  echo "      First-time setup (if SSH works):" >&2
  echo "      ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${DEPLOY_PATH} && touch ${DEPLOY_PATH}/.deploy-marker'" >&2
  exit 1
}

npm run build

rsync -avz --delete --exclude='.deploy-marker' \
      dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

HTTP_CODE=$(curl -sSL -o /dev/null -w "%{http_code}" --max-time 10 "${DEPLOY_URL}")
[[ "${HTTP_CODE}" =~ ^2[0-9][0-9]$ ]] \
  && echo "OK: ${DEPLOY_URL} -> HTTP ${HTTP_CODE}" \
  || { echo "FAIL: ${DEPLOY_URL} -> HTTP ${HTTP_CODE}" >&2; exit 1; }
