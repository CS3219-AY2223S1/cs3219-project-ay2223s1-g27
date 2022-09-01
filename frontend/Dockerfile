# Specify a base image
FROM node:alpine as build

# Create working directory and copy the app before running npm install as the artifactory
# credentials can be inside .npmrc
WORKDIR /usr/src/app
COPY . .

# Run yarn install
RUN npm install && npm build

FROM node:alpine as main

COPY --from=build /usr/src/app/build /

# Install serve command for yarn package manager
RUN npm install -g serve@13.0.4

# Export port
EXPOSE 3000

# Build and serve the project
CMD serve -p 3000 -s .
