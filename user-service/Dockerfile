FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "start"]
