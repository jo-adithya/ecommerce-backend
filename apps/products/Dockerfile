FROM node:alpine

WORKDIR /usr/src/app

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile

COPY . .

CMD ["pnpm", "run", "start", "products"]
