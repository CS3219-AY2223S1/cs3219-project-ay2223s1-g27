FROM node

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install

EXPOSE 8002

CMD ["npm", "run", "start"]
