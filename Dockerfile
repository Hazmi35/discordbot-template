FROM node:14-alpine as build-stage

# NOTE: Change these as you want
LABEL name "discordbot-template (build-stage)"
LABEL maintainer "Hazmi35 <contact@hzmi.xyz>"

WORKDIR /tmp/build

# Install build tools for node-gyp
RUN apk add --no-cache build-base git python3

# Copy package.json and yarn.lock
COPY package.json .
COPY yarn.lock .

# Install node dependencies
RUN yarn install

# Now copy project files
COPY . .

# Build typescript project
RUN yarn run build

# Prune dev dependencies
RUN yarn install --production

# Get ready for production
FROM node:14-alpine

# NOTE: Change these as you want
LABEL name "discordbot-template"
LABEL maintainer "Hazmi35 <contact@hzmi.xyz>"

WORKDIR /app

# Install dependencies
RUN apk add --no-cache tzdata

# Copy needed project files
COPY --from=build-stage /tmp/build/package.json .
COPY --from=build-stage /tmp/build/yarn.lock .
COPY --from=build-stage /tmp/build/node_modules ./node_modules
COPY --from=build-stage /tmp/build/dist .

VOLUME [ "/app/logs" ]

CMD ["node", "index.js"]
