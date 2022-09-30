# Specify a base image
FROM node:alpine as build

# Create working directory and copy the app before running npm install as the artifactory
# credentials can be inside .npmrc
WORKDIR /usr/src/app
COPY . .

RUN touch .env && \
    echo REACT_APP_URI_MATCHING_SVC=http://34.160.41.4 >> .env && \
    echo REACT_APP_URI_USER_SVC=http://34.160.41.4 >> .env && \
    echo REACT_APP_URI_COLLAB_SVC=http://34.160.41.4 >> .env && \
    npm install --legacy-peer-deps

# Export port
EXPOSE 3000

# Build and serve the project
CMD npm run start
