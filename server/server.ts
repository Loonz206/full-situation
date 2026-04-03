import express from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import "./models";
import "./services/auth";
import schema from "./schema/schema";

dotenv.config();

const port = process.env.PORT || 4000;

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET environment variable is not set. Please configure it before starting the server."
  );
}
const sessionSecret = process.env.SESSION_SECRET;

// Create a new Express application
const app = express();
app.disable("x-powered-by");

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@full-situation.7qq2i.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = globalThis.Promise;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect(MONGO_URI);
mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", (error) => console.log("Error connecting to MongoLab:", error));

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoStore = require("connect-mongo")(session);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: sessionSecret,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true,
    }),
  })
);

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also services/auth.ts
app.use(passport.initialize());
app.use(passport.session());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV !== "production",
  })
);

app.listen(port, () => {
  console.log(
    `full-situation app listening at http://localhost:${port}/graphql`
  );
});

// Webpack runs as a middleware.  If any request comes in for the root route ('/')
// Webpack will respond with the output of the webpack process: an HTML file and
// a single bundle.js output of all of our client side Javascript
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackMiddleware = require("webpack-dev-middleware");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require("../webpack.config.js");
app.use(webpackMiddleware(webpack(webpackConfig)));

export default app;
