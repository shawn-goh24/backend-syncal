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
// const transactionsRouter = require("./routers/TransactionsRouter");
// const categoriesRouter = require("./routers/CategoriesRouter");
// const incomeExpensesRouter = require("./routers/IncomeExpensesRouter");
// const budgetsRouter = require("./routers/BudgetsRouter");
// const billRouter = require("./routers/BillsRouter");
// const notificationRouter = require("./routers/NotificationsRouter");

// enforce on all endpoints
// get PORT from .env
const PORT = process.env.PORT;
// instantiate express
const app = express();
app.use(cors());
app.use(express.json());
// app.use(checkJwt);

app.use("/user", usersRouter);
// app.use("/transaction", checkJwt, transactionsRouter);
// app.use("/category", checkJwt, categoriesRouter);
// app.use("/incomeexpense", checkJwt, incomeExpensesRouter);
// app.use("/budget", checkJwt, budgetsRouter);
// app.use("/bill", checkJwt, billRouter);
// app.use("/notification", checkJwt, notificationRouter);

app.listen(PORT, () => {
  console.log(`Application listening to port ${PORT}`);
});
