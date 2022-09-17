gpg --decrypt .env.gpg > .env

export MACBOOK=true
npm run start
rm .env
