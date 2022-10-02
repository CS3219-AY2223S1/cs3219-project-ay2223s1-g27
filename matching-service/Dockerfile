FROM node

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm i sqlite3 -D && rm -rf node_modules && npm i && npm rebuild

EXPOSE 8001

CMD ["npm", "run", "start"]
