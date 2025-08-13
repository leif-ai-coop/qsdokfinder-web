FROM node:18-alpine AS build
WORKDIR /app
COPY templatetailwind/package*.json ./
COPY templatetailwind/tailwind.config.js ./tailwind.config.js
COPY templatetailwind/postcss.config.js ./postcss.config.js
RUN npm ci
COPY templatetailwind /app
COPY qsdokfinder-web/src /app/src
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY qsdokfinder-web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


