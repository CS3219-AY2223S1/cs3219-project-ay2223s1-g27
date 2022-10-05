# Specify a base image
FROM node:alpine as build

# Create working directory and copy the app before running npm install as the artifactory
# credentials can be inside .npmrc
WORKDIR /usr/src/app
COPY . .

RUN touch .env && \
    echo REACT_APP_RAPID_API_URL=https://judge0-ce.p.rapidapi.com/submissions >> .env && \
    echo REACT_APP_RAPID_API_HOST=judge0-ce.p.rapidapi.com >> .env && \
    echo REACT_APP_RAPID_API_KEY=8e10b077b8msh375ad963d374707p1e6cacjsna72e350a2322 >> .env && \
    npm install --legacy-peer-deps && \
    npm run build

FROM node:alpine as main

COPY --from=build /usr/src/app/build /

# Install serve command for yarn package manager
RUN npm install -g serve@13.0.4

# Export port
EXPOSE 3000

# Build and serve the project
CMD serve -p 3000 -s .
