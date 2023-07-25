npm install
echo "Installed my node modules"

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed --seed 20230628054908-seeder-role.js
npx sequelize-cli db:seed --seed 20230628054921-seeder-rsvp.js