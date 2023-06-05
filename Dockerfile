FROM node:19.5.0-alpine AS installer
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY . .
RUN npm install -g @angular/cli
RUN npm install

FROM node:19.5.0-alpine AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY --from=installer /app .
RUN ls -a /app
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx as production
ENV NODE_ENV production
# Copy built assets from builder
RUN rm /usr/share/nginx/html/*
COPY --from=builder /app/dist/final-project /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
