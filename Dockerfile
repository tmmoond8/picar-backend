FROM node:18-alpine

WORKDIR /usr/src/app

# Install PM2 globally
RUN yarn global add pm2

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 6060

# The command will be overridden by docker-compose.yml
CMD ["yarn", "dev"] 