import http from "http";
import WebSocket from "ws";
import { IMessage } from "./types";
import { validators } from "./validators";
import { Readable } from "stream";
import { Database } from "./database";

/**
 * The physical representation of a channel
 * @author Geoxor
 */
class Room {
  public id: string;
  public websockets: WebSocket[] = [];
  constructor(id: string) {
    this.id = id;
  }

  public async join(ws: WebSocket) {
    this.websockets.push(ws);
  }

  public async emit(event: string, message: any){
    for (let i = 0; i < this.websockets.length; i++) {
      const websocket = this.websockets[i];
      websocket.emit(event, Readable.from(JSON.stringify(message)))
    }
  }
}

export class WebSocketManager {
  public wss: WebSocket.Server;
  public rooms: Map<string, Room> = new Map([["@global", new Room("@global")]]);
  constructor(server: http.Server){

    console.log(this.rooms);

    this.wss = new WebSocket.Server({ server });
    this.wss.on('connection', ws => {
      console.log("New Connection");
      
      ws.on("message", async buffer => {
        const message: IMessage = JSON.parse(buffer.toString());

        console.log(message);
        
        try {
          await validators.messageContent.validateAsync(message.content);
        } catch (error) {
          return console.log(error);
        }

        // Cache the message in ram
        // Store.push(message);

        // Add the message to the database
        // Database.message();
        
        // Validate if channel exists and if it does actually create a room
        const room = this.rooms.get(message.channel_id);
        if (!room) return;

        console.log(room);

        // Actually emit a new Message or validate the message we got
        room.emit('message', "hello")
      });
      ws.on("join", async buffer => {
        const roomID: string = JSON.parse(buffer.toString());
        const room = this.rooms.get(roomID);
        if (room) room.join(ws);
      });
    });
  }

  public newRoom(channelUuid: string, ws: WebSocket) {
    const room = this.rooms.set(channelUuid, new Room(channelUuid)).get(channelUuid);
    room!.join(ws);
  }
}