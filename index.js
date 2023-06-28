// imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Auth0
const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth({
  audience: "https://syncal/api",
  issuerBaseURL: "https://dev-e27oql725amd8bwx.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const usersRouter = require("./routers/UsersRouter");

// enforce on all endpoints
// get PORT from .env
const PORT = process.env.PORT;
// instantiate express
const app = express();
app.use(cors());
app.use(express.json());
// app.use(checkJwt);

app.use("/user", usersRouter);

app.listen(PORT, () => {
  console.log(`Application listening to port ${PORT}`);
});
