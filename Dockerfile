# Build container
FROM node:18-alpine as builder
ENV NODE_ENV production
WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/app/.yarn/cache yarn install --immutable
RUN yarn run common:build && \
    yarn run server:build && \
    yarn run client:build && \
    yarn workspaces focus @easy-show-downloader/server --production && \
    rm -rf node_modules/.cache

# Run container
FROM node:18-alpine as runner

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001 && mkdir /data && chown -R nodejs:nodejs /data 

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app .

RUN yarn cache clean

ENV STATIC_DIR /app/client/public
ENV PORT 3000
ENV LOG_STDOUT true
ENV DATA_FILE /data/data.json

EXPOSE 3000

USER nodejs

CMD ["yarn", "start"]
