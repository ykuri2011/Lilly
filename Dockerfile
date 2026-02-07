FROM node:20-slim AS build

WORKDIR /app

COPY package.json ./
RUN npm ci --omit=dev

FROM node:20-slim

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --from=build /app/node_modules ./node_modules
COPY package.json server.js ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

USER appuser

CMD ["node", "server.js"]
