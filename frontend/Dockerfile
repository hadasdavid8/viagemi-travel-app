FROM node:20 AS build-stage
WORKDIR /app

ARG REACT_APP_GOOGLE_MAPS_API_KEY
ARG REACT_APP_API_BASE_URL

ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY package*.json ./
RUN npm install --verbose
COPY . .
RUN REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL \
    REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY \
    npm run build --verbose

FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
