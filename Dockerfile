###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine3.17 as development
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
RUN yarn install --frozen-lockfile
COPY  ./ ./
EXPOSE 8080

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine3.17 as builder
ENV NODE_ENV production
WORKDIR /home/node
COPY . /home/node/
RUN yarn
RUN yarn install -g @nestjs/cli
RUN yarn install --frozen-lockfile && yarn build && yarn install --production --ignore-scripts --prefer-offline

###################
# PRODUCTION
# ###################

FROM node:18-alpine3.17 as production
ENV NODE_ENV production
WORKDIR /home/node
COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules /home/node/node_modules
COPY --from=builder /home/node/build /home/node/build
CMD [ "node", "build/main.js" ]
