FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY scripts/serve-dist.mjs ./scripts/serve-dist.mjs
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "scripts/serve-dist.mjs"]
