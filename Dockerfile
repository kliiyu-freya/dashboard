# Stage 1: Build Astro app
FROM node:lts AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the Astro app
RUN npm run build

# Stage 2: Setup NGINX and Avahi with the built app
FROM nginx:alpine AS runtime

# Install Avahi and related packages
RUN apk add --no-cache avahi dbus

# Copy the NGINX configuration into the container
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the built Astro app into the NGINX HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Avahi service configuration (optional if you want a specific hostname or service type)
COPY ./avahi/avahi-daemon.conf /etc/avahi/avahi-daemon.conf
COPY ./avahi/services/ /etc/avahi/services/

# Expose ports
EXPOSE 80 6673

# Start both NGINX and Avahi
CMD ["sh", "-c", "avahi-daemon --no-drop-root & nginx -g 'daemon off;'"]
