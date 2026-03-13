###################
#       Deps
###################
FROM node:24-alpine AS deps

WORKDIR /usr/src/workspace

ENV PNPM_HOME="/pnpm"
ENV PNPM_STORE_DIR="/pnpm/store"
RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY packages/core/package.json packages/core/
COPY apps/auth-service/package.json apps/auth-service/

RUN --mount=type=cache,id=pnpm-store-node24,target=/pnpm/store,sharing=locked \
    pnpm fetch

###################
#     Builder
###################
FROM deps AS builder

WORKDIR /usr/src/workspace

COPY . .

RUN --mount=type=cache,id=pnpm-store-node24,target=/pnpm/store,sharing=locked \
    pnpm install --offline --frozen-lockfile

RUN pnpm --filter '{packages/core}' \
         --filter '{apps/auth-service}' \
         build

RUN pnpm deploy --filter '{apps/auth-service}' --prod /app

###################
#   Application
###################
FROM node:24-alpine

USER 1000:1000

WORKDIR /app

COPY --from=builder --chown=1000:1000 /app ./
RUN install -m 0775 -d /app/logs

ENV NODE_ENV=production

CMD ["node", "./dist/main.js"]
