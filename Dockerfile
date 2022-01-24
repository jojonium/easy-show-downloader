FROM node:16-alpine as builder
ENV NODE_ENV production
WORKDIR /app

COPY . .

RUN yarn rebuild
RUN yarn common:build
RUN yarn server:build
RUN yarn client:build

FROM node:16-alpine as runner

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

ENV NODE_ENV production
WORKDIR /app

COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.pnp.cjs ./.pnp.cjs
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/package.json

RUN mkdir /data
RUN chown -R nodejs:nodejs /data

ENV STATIC_DIR /app/client/public
ENV PORT 3000
ENV LOG_STDOUT true
ENV DATA_FILE /data/data.json

EXPOSE 3000

USER nodejs

CMD ["yarn", "start"]
