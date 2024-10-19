# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json and tsconfig.json first to utilize Docker caching
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . ./

# Run build commands if necessary (skip if not needed)
# RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy package.json and tsconfig.json to production container
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/tsconfig.json /app/tsconfig.json

# Copy node_modules from build stage (caching)
COPY --from=build /app/node_modules /app/node_modules

# Copy the rest of the source code
COPY --from=build /app/src /app/src
COPY --from=build /app/.env /app/.env

# Install nodemon globally
RUN npm install -g nodemon

EXPOSE 4001

# Run the application
CMD ["npm", "run", "dev"]
