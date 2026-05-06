FROM node:20-alpine

ENV INSTALL_PATH /app
ENV PATH $INSTALL_PATH/node_modules/.bin:$PATH

COPY package.json package-lock.json /tmp/
# hadolint ignore=DL3003
RUN cd /tmp && npm install \
    && mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

COPY . $INSTALL_PATH

WORKDIR $INSTALL_PATH

CMD ["npm", "run", "build"]
