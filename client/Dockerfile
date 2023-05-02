FROM node:14 AS ui-build 
WORKDIR /usr/src/app
COPY ./ ./
RUN yarn && yarn run react-build

COPY package*.json ./

# Copy local code to the container image.

# Run the web service on container startup.
CMD [ "npm", "run", "start" ]