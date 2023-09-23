FROM node:18.17.1
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install -g nodemon
COPY . ./
EXPOSE 5000
CMD ["npm", "start"]
