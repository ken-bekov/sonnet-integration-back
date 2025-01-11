FROM node:22.9.0-alpine AS build
COPY . /source
WORKDIR /source
RUN npm install
RUN npm run build

FROM node:22.9.0-alpine
WORKDIR /app
COPY --from=build /source/dist/ai-integration-backend.js .
COPY --from=build /source/package.json .
RUN npm install
CMD ["node",  "ai-integration-backend.js"]