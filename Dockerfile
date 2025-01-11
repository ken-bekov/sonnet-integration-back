FROM node:22.9.0-alpine AS build
COPY . /source
WORKDIR /source
RUN npm install
RUN npm run build

FROM node:22.9.0-alpine
COPY --from=build /source/dist/ai-integration-backend.js /app
WORKDIR /app
CMD node ai-integration-backend.js