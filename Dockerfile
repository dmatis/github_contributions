FROM node:8

WORKDIR /usr/src/app

COPY README.md index.js package-lock.json package.json ./

RUN npm install

CMD ["node","index.js","Dogild"]
