FROM node:24.15.0-trixie

ENV INSTALL_PATH /app
ENV PATH $INSTALL_PATH/node_modules/.bin:$PATH

COPY package.json package-lock.json /tmp/
# Keep this here for the convenience of developers who are using Hadolint
# in their local development environments.
# DL3003 is "Use absolute paths, or use WORKDIR to switch to a directory."
# hadolint ignore=DL3003
RUN cd /tmp && npm install \
    && mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

COPY . $INSTALL_PATH

WORKDIR $INSTALL_PATH

CMD ["npm", "run", "build"]
