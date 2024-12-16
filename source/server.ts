import express, { Express, Router, json } from "express";
import responseTime from "response-time";
import Helmet from "helmet";
import UidCheckerRouter from "./routers/UidCheckerRouter";
import { Configuration } from "./models/ConfigurationModel.js";

export default function createApp(configuration: Configuration): {
  app: Express;
  router: Router;
} {
  const app: Express = express();

  app.use(Helmet());
  app.use(json());

  app.use(responseTime({ suffix: true }));

  const router = UidCheckerRouter(configuration);
   app.use(router);
  return { app, router };
}
