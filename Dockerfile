### Build web image
FROM node:24-alpine3.21 as builder

#Set arguments
ARG VITE_API_BASE_URL
ARG VITE_API_TOKEN

WORKDIR /app
COPY ./ /app/

RUN rm -rf package-lock.json
RUN npm install
RUN npm run build

FROM nginx:1.29.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

RUN chgrp 0 /etc/nginx/nginx.conf && chmod g+w /etc/nginx/nginx.conf && \
    chmod -R 755 /usr/share/nginx/html/* && \
    rm /etc/nginx/conf.d/* && \
    mkdir -p /run/nginx/ && \
    touch /run/nginx/nginx.pid && \
    chmod -R 770 /var/cache/nginx/ /run/nginx
EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]