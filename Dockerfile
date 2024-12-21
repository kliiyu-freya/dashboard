FROM node:lts AS build

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine AS runtime

RUN apk add --no-cache avahi

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /etc/nginx/nginx.sh

EXPOSE 80
EXPOSE 6673
CMD ["sh", "-c", "avahi-daemon & nginx -g 'daemon off;'"]