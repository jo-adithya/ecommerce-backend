######################
# BASE STAGE
######################

FROM node:alpine As base

ENV PNPM_HOME=/usr/local/bin

RUN corepack enable && corepack prepare pnpm@latest --activate

######################
# BUILD STAGE
######################

FROM base AS build

WORKDIR /usr/src/app

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build products

######################
# PRODUCTION STAGE
######################

FROM base As production

USER node

WORKDIR /usr/src/app

# Copy only the required files to the final container
COPY --from=build --chown=node:node /usr/src/app/dist/apps/products ./

ENV NODE_ENV=production

RUN pnpm install
RUN pnpm install tslib pino-pretty

CMD ["node", "main.js"]
