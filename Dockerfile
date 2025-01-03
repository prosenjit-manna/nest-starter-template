FROM node:20

# Add Maintainer Info
LABEL maintainer="Prosenjit Manna <prosenjit@itobuz.com>"


# Install Chromium
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-glib-1-2 \
    libx11-xcb1 \
    xdg-utils \
    && apt-get clean    

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY .env ./
RUN npm install -g corepack
RUN yarn 


# Command to run the executable
USER root

CMD ["npm", "run", "start:dev"]
