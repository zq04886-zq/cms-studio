FROM node:24.22.0-bookworm-slim AS build
WORKDIR /app
COPY cms-manage/package*.json cms-manage/
COPY crs/package*.json crs/
RUN cd cms-manage && npm ci --ignore-scripts && cd ../crs && npm ci --ignore-scripts
COPY cms-manage cms-manage
COPY crs crs
RUN cd cms-manage && npm run build && cd ../crs && npm run build
FROM node:24.22.0-bookworm-slim
WORKDIR /app/cms-node
COPY cms-node/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY cms-node ./
RUN npm run db:generate
COPY --from=build /app/cms-manage/dist /app/cms-manage/dist
COPY --from=build /app/crs/dist /app/crs/dist
RUN mkdir -p /app/cms-node/data/uploads && chown -R node:node /app
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3300
EXPOSE 3300
CMD ["node", "index.js"]
