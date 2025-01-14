# Install dependency in mac  
- Node - v20.12.2
- npm install -g corepack 
- Install docker 

## Setup 
- docker-compose up -d 
- This will start database server locally 

- Clone repository 
- yarn 
- npm run db:push 
- npm run db:seed
- npm run start:dev - run development server 
- Create .env file and add required variables 
- once you start dev server in console required variables will be listed 



## Sonar Analysis 
docker run --name sonarqube-custom -p 9000:9000 sonarqube:community
docker run \
    --rm \
    -e SONAR_HOST_URL="http://${SONARQUBE_URL}"  \
    -e SONAR_TOKEN="myAuthenticationToken" \
    -v "${YOUR_REPO}:/usr/src" \
    sonarsource/sonar-scanner-cli


 