FROM node:alpine As development

WORKDIR /usr/src/app

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile

COPY . .

CMD ["pnpm", "run", "build", "products"]



FROM node:alpine As production

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile --prod --ignore-scripts

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/products/main"]
