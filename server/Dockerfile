FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /server

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npx prisma generate

EXPOSE 3000

COPY wait-for-db.sh /server/wait-for-db.sh
RUN chmod +x /server/wait-for-db.sh

CMD ["/bin/bash", "/server/wait-for-db.sh"]
