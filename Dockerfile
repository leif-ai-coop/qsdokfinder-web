FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tailwind.config.js ./tailwind.config.js
COPY postcss.config.js ./postcss.config.js
# Use lockfile if present, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . /app
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


