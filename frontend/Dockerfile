# Specify a base image
FROM node:alpine as build

# Create working directory and copy the app before running npm install as the artifactory
# credentials can be inside .npmrc
WORKDIR /usr/src/app
COPY . .

RUN touch .env && \
    echo REACT_APP_URI_MATCHING_SVC=http://34.160.41.4 >> .env && \
    echo REACT_APP_URI_USER_SVC=http://34.160.41.4 >> .env && \
    echo REACT_APP_URI_COLLAB_SVC=http://34.160.41.4 >> .env

RUN --mount=type=bind,target=. \
  --mount=type=secret,id=REACT_APP_RAPID_API_URL \
  echo "REACT_APP_RAPID_API_URL=$(cat /run/secrets/REACT_APP_RAPID_API_URL)" >> .env

RUN --mount=type=bind,target=. \
  --mount=type=secret,id=REACT_APP_RAPID_API_HOST \
  echo "REACT_APP_RAPID_API_HOST=$(cat /run/secrets/REACT_APP_RAPID_API_HOST)" >> .env

RUN --mount=type=bind,target=. \
  --mount=type=secret,id=REACT_APP_RAPID_API_KEY \
  echo "REACT_APP_RAPID_API_KEY=$(cat /run/secrets/REACT_APP_RAPID_API_KEY)" >> .env

RUN npm install --legacy-peer-deps && \
    npm run build

FROM node:alpine as main

COPY --from=build /usr/src/app/build /

# Install serve command for yarn package manager
RUN npm install -g serve@13.0.4

# Export port
EXPOSE 3000

# Build and serve the project
CMD serve -p 3000 -s .
