# Nest starter kit 


## Stacks 
- Nest js - https://nestjs.com/
- Postgresql - https://www.postgresql.org/
- Prisma - https://www.prisma.io/docs
- Graphql 

## Features included 

## Features - Backlog 
- Authentication 
- Role based access control 
- Multi tenancy
- Email Template 
- File manager 
- Subscription 
- Payment gateway implementation 
- DB based translation 
- Audit 
- App notification 
- Mailer transport 
  - Node mailer 
  - SES 
- Sentry Error handling 
- Google analytics 
- Documentation 
- E2E

## Docs 
- Development notes - docs/development.md
  
### Prod server run locally
docker-compose -f docker-compose-prod.yml run app yarn
docker-compose -f docker-compose-prod.yml up -d --build --force-recreate --remove-orphans
docker build . --no-cache --force-recreate
