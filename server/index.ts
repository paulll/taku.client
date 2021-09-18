console.clear();
require("dotenv").config();

import chalk from "chalk";
import express, { Express } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import "./models/User";
import { V1, V1WSS } from "./routes";
import WebSocket from 'ws';

export const THEME_COLOR = "#ff00b6";
export const PORT = process.env.PORT || 8081;
export const SALT_ROUNDS = 10;

const LOGO = chalk.hex(THEME_COLOR)(`  ___       ___       ___       ___   
 /\\  \\     /\\  \\     /\\__\\     /\\__\\  
 \\:\\  \\   /::\\  \\   /:/ _/_   /:/ _/_ 
 /::\\__\\ /::\\:\\__\\ /::-"\\__\\ /:/_/\\__\\
/:/\\/__/ \\/\\::/  / \\;:;-",-" \\:\\/:/  /
\\:\\__\\     /:/  /   |:|  |    \\::/  / 
 \\/__/     \\/__/     \\|__|     \\/__/   ${require("./package.json").version}
`);
console.log(LOGO);

class TAKU {
  public express: Express;
  public server: http.Server;
  public port: number = 8081;
  public wss: WebSocket.Server;

  public constructor(port: Number = 8081) {
    this.express = express();
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use("/v1", V1);
    this.server = http.createServer(this.express);
    this.server.listen(port, () => console.log(`[INDEX] Started on port ${port.toString()}`));
    this.wss = new WebSocket.Server({ server: this.server });
    this.wss.on('connection', ws => new WebSocketManager(ws));
  }
};

class WebSocketManager {
  public ws: WebSocket;
  constructor(ws: WebSocket){
    this.ws = ws;
    this.registerListeners();
  }

  public registerListeners () {
    for (let i = 0; i < V1WSS.length; i++) {
      const listener = V1WSS[i];
      this.ws.on(listener.event, listener.handler);
    }
  }
}

export default new TAKU();