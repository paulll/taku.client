console.clear();
require("dotenv").config();

import chalk from "chalk";
import express, { Express } from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import "./models/User";
import { V1 } from "./routes";
import io from "socket.io";
import { socketAuth } from "./middlewares/socket";
import { IUser } from "./types";
import { Message } from "./models/Message";
import { Database } from "./database";

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
  public io: io.Server;

  public constructor(port: Number = 8081) {
    this.express = express();
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use("/v1", V1);
    this.server = http.createServer(this.express);
    this.io = new io.Server(this.server);
    this.io.use(socketAuth);
    this.io.on("connection", (socket: {user?: IUser} & io.Socket) => {
      console.log(`[WS] New connection (${this.getTotalSockets()} total connections)`);
      socket.emit("message", "Hello client!");
      socket.join("@global");
      socket.on("globalMessage", async content => {
        const message = await Database.newMessage({content, author_id: socket.user!._id, channel_id: "@global"});
        this.io.to("@global").emit("globalMessage", message);
      });
    });
    this.server.listen(port, () => console.log(`[INDEX] Started on port ${port.toString()}`));
  }

  private getTotalSockets = () => this.io.of("/").sockets.size;
};

export default new TAKU();