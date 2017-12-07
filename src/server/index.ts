
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as passport from "passport";
import * as morgan from "morgan";

import * as path from "path";

import loadRoutes from "./routes";
import config from "../config";
import "../eth";

const chalk = require("chalk");

const Flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

const PROD = process.env.NODE_ENV === "production";

var app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(bodyParser.raw({
  limit: "10mb"
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  store: new FileStore({ path: "/tmp/cagr-session-cache" }),
  secret: config.get("secret"),
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(Flash());
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "..", "..", "build", "app")));
app.use(express.static(path.join(__dirname, "..", "..", "static")));

if (!PROD) {
  const webpack = require("webpack");
  const wpconfig = require("../../webpack.config.js");
  const compiler = webpack(wpconfig);
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: false,
    publicPath: wpconfig.output.publicPath
  }));
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 2 * 1000
  }));
}

app.use(loadRoutes(app));

app.listen(config.get("app:port"), function() {
  console.log(`${chalk.blue.bold.underline("Webserver started")} <${config.get("app:port")}>`)
});
