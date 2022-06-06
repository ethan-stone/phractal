FROM node:16.15.0-alpine3.15 AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/ 

RUN npm install

COPY . .

RUN npm run build

FROM node:16.15.0-alpine3.15 AS production 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/main" ]

