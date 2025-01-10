  
### Prod server run locally
docker-compose -f docker-compose-prod.yml up -d --build --force-recreate --remove-orphans
docker build . --no-cache --force-recreate