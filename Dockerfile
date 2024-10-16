FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install && npm install -g nodemon

EXPOSE 4001

CMD ["npm", "run", "dev"]
