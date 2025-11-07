FROM node:22-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm i -g @angular/cli

COPY . .
RUN ng build --configuration production

FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]