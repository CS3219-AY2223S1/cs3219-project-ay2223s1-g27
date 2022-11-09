# Specify a base image
FROM node:alpine as build

# Create working directory and copy the app before running npm install as the artifactory
# credentials can be inside .npmrc
WORKDIR /usr/src/app
COPY . . 

RUN npm install -g nodemon
RUN npm install

# Export port
EXPOSE 3000

CMD nodemon  
