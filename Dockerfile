### STAGE 1: Build ###
FROM quay.io/sartography/node:latest
RUN mkdir /app
WORKDIR /app
ADD package.json /app/
ADD package-lock.json /app/
COPY . /app/
RUN npm ci && npm run build

ENTRYPOINT ["/app/bin/boot_server_in_docker"]
