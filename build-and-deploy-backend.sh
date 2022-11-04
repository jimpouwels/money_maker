cd packages/backend
rm -rf dist/**
tsc
cp .env ./dist
cp config.json ./dist
scp -r ./dist raspberry:~/projects/money_maker/backend