# Build container
FROM node:22-alpine AS builder
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Now copy the app files
COPY . .

RUN yarn --immutable

RUN yarn run build && \
    yarn workspaces focus @easy-show-downloader/server --production && \
    rm -rf node_modules/.cache

# Run container
FROM node:22-alpine AS runner

ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 && mkdir /data && chown -R nodejs:nodejs /data

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app .

ENV STATIC_DIR=/app/client/build
ENV PORT=3000
ENV LOG_STDOUT=true
ENV DATA_FILE=/data/data.json

EXPOSE 3000

USER nodejs

CMD ["yarn", "start"]
