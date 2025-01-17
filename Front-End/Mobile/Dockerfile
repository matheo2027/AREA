FROM ubuntu:22.04

RUN apt-get update && \
  apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs

COPY package*.json ./
COPY .expo /.expo

WORKDIR /Mobile

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

RUN npm install && npm install -g expo-cli
CMD [ "npm", "start" ]
