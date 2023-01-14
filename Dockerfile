FROM node:18 as client-dependencies
WORKDIR /app
COPY /client/package*.json ./
RUN npm ci --only-production

FROM node:18 as client-build
WORKDIR /app
COPY ./client .
COPY --from=client-dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:18 as server-dependencies
WORKDIR /app
COPY /server/package*.json ./
RUN npm ci --only-production

FROM node:18 as server-build
WORKDIR /app
COPY ./server .
COPY --from=server-dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:18 as runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system -gid 1001 nodejs
RUN adduser --system -uid 1001 primary

COPY --from=client-build --chown=primary:nodejs /app/dist-client ./dist-client
COPY --from=server-build --chown=primary:nodejs /app/dist ./dist
COPY --from=server-build --chown=primary:nodejs /app/node_modules ./node_modules
COPY --from=server-build --chown=primary:nodejs /app/package.json ./package.json

USER primary

EXPOSE 3000

CMD ["npm", "start"]