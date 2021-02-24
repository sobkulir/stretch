FROM alpine 

RUN apk add --update nodejs npm
RUN npm install -g hostr

EXPOSE 8080
