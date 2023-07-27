# Syncal Backend

A backend application for "Syncal" calendar sharing application that facilitates collaborative scheduling with friends and family. This platform allows multiple individuals to work together on the same calendar, making it easier to coordinate plans, events, and activities.
Project 3 for Rocket Academy Bootcamp

## Features

- Add new users or check for existing users in the database
- Add, edit, and delete calendars and events into database created by user
- Handle Google's OAuth2.0 to get user refresh token, and grab google calendar events
- Grab all informations regarding calendar and events in database
- Send email invites to calendar with SendGrid Api

## Tech Used

- Backend: [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/), [Sequelize](https://sequelize.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- API: [SendGrid](https://sendgrid.com/), [GCP for Gogole Calendar API](https://cloud.google.com/)

## Setup

Before starting, it is required to run the following steps for the application to work. Make sure you have all the necessary software before running this

1. Set up [SendGrid](https://www.youtube.com/watch?v=qFDgH6dHRA4&ab_channel=MafiaCodes), [Auth0](https://www.youtube.com/watch?v=jgKRnhJBfpQ&t=332s&ab_channel=codeSTACKr) and [Google Calendar API](https://www.youtube.com/watch?v=njjGOz3L4WU&t=1s&ab_channel=RobotSquad) before proceeding. Click on Link for set up guides.

2. Clone repo to local

3. Configure `.env` file, make sure to get your own API keys stated below and insert it into your `.env` file
   - If unsure where to get API keys, refer to the Tech Used for the documents

```
PORT = <Insert PORT number for your backend, e.g. 8080>
USERNAME = <PostgreSQL username, e.g. postgres>
PASSWORD = <Insert password if exist>
DATABASE = <Insert database name, e.g. kaching>
HOST = localhost
DIALECT = <Insert dialect, for this app is postgres>

SENDGRID_API_KEY = <Insert SENDGRID API key>

GOOGLE_CLIENT_ID = <Insert Google Client ID>
GOOGLE_CLIENT_SECRET = <Insert Google Client Secret>

CLIENT = <Insert Client URL (e.g. localhost:3000)>

AUTH0_ISSUER_BASE_URL = <Insert Auth0 Isser Base URL>
AUTH0_CLIENT_ID = <Insert Auth0 Client ID>
AUTH0_CLIENT_SECRET = <Insert Auth0 Client Secret>
AUTH0_AUDIENCE = <Insert Auth0 Audience>
```

4. Install all dependencies required in this repo

```
npm i
```

5. Next run database migration, and seeders before starting. Make sure no error.

```
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed --seed 20230628054908-seeder-role.js
npx sequelize db:seed --seed 20230628054921-seeder-rsvp.js
```

6. Once done, run either one of the command below to run

```
node index.js
nodemon index.js
```

7. Enjoy! You can use postman to test out the requests

## Future improvements

- More functions/routers to make better requests
- Add functions for cron jobs to notify users when a event is arriving

## Other references

- ERD Image

## Contributors

- [Me, Shawn Goh](https://github.com/shawn-goh24)
