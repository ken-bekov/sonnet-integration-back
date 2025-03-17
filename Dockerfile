FROM node:22.9.0-alpine AS build
COPY . /source
WORKDIR /source
RUN npm install
RUN npm run build

FROM node:22.9.0-alpine
COPY --from=build /source/migrations/ /migrations
WORKDIR /app
COPY --from=build /source/dist/application.js .
COPY --from=build /source/dist/request-worker.js .
COPY --from=build /source/package.json .
RUN npm install --omit=dev
CMD ["node",  "application.js", "migrate"]
