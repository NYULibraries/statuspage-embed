FROM node:18-alpine

ENV INSTALL_PATH /app
ENV PATH $INSTALL_PATH/node_modules/.bin:$PATH

COPY package.json yarn.lock /tmp/
# hadolint ignore=DL3003
RUN cd /tmp && yarn install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

COPY . $INSTALL_PATH

WORKDIR $INSTALL_PATH

CMD ["NODE_ENV=production", "yarn", "build:prod"]