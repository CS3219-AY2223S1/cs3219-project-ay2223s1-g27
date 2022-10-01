FROM node

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install

EXPOSE 8003

CMD ["npm", "run", "start"]
