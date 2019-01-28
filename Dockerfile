FROM node:8

WORKDIR /usr/src/app

COPY README.md index.js package-lock.json package.json ./

EXPOSE 3000

RUN npm install

ENTRYPOINT ["node","index.js"]
