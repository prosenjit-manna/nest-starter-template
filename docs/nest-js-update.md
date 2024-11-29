## Update procedure 

## Update nest js dependencies 
npm i -g npm-check-updates
ncu -u -f /^@nestjs/
rm -rf node_modules
rm -rf yarn.lock


## Update other dependencies  
ncu 
get logs for available updates 
understand breaking changes and and updates logs 