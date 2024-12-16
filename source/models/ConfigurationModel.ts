import { Server } from "http";
import fs from "fs";

type ExpressServerOptions = Pick<
  Server,
  | "keepAliveTimeout"
  | "maxHeadersCount"
  | "timeout"
  | "maxConnections"
  | "headersTimeout"
  | "requestTimeout"
>;

type Services = {
  euServiceURL: string;
  switzerlandServiceURL: string;
};

export interface Configuration {
  readonly port: number;
  readonly expressServerOptions: ExpressServerOptions;
  readonly services: Services;
}

export const readAppConfiguration = (file: string): Configuration => {
  const configuration: Configuration = JSON.parse(
    fs.readFileSync(file, "utf-8")
  );

  return configuration;
};
