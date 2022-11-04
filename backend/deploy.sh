rm -rf ./dist/**
tsc
npm run copy-files
scp -r ./dist raspberry:~/projects/money_maker/backend