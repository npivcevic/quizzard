import { Injectable, Inject } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection
  public data: String[] = [];
  public connectionId: string = "";
  public hostConnectionId: string = "";
  public players: string[] = [];
  public isHost: Boolean = false;
  public groupName: string = "";

  constructor(@Inject('BASE_URL') private baseUrl: string) { }

  public startConnection () {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(`${this.baseUrl}quizhub`)
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  private getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid')
    .then((data) => {
      console.log(data);
      this.connectionId = data;
    });
  }
  
  public addTransferDataListener = () => {
    this.hubConnection.on('transferdata', (data) => {
      this.data.push(data)
      this.processMessage(data)
      console.log('data received', data);
    });
  }

  public sendToHost = (data: string) => {
    console.log("sending to host", this.hostConnectionId, "data", data)
    this.hubConnection.invoke('sendtohost', this.hostConnectionId, data)
    .catch(err => console.error(err));
  }

  public sendToGroup = (groupName: string, data: string) => {
    this.hubConnection.invoke('sendtogroup', groupName, data)
    .catch(err => console.error(err));
  }

  public hostQuiz = (groupName: string) => {
    this.hubConnection.invoke('hostquiz', groupName)
    .catch(err => console.error(err));
    this.isHost = true
    this.groupName = groupName;
  }

  public joinQuiz = (groupName: string, playerName: string) => {
    this.hubConnection.invoke('joinquiz', groupName, playerName)
    .catch(err => console.error(err));
  }

  private processMessage(data:string) {
    console.log("processing message", data)
    let message = JSON.parse(data)
    console.log("message", message)
    if (message.action==="PlayerJoined" && this.isHost) {
      console.log("adding player", message.data)
      this.players.push(message.data)
      let data = {
        action: "HostConnectionId",
        data: this.connectionId
      }
      this.sendToGroup(this.groupName, JSON.stringify(data))
    }
    if (message.action==="HostConnectionId" && !this.isHost) {
      console.log("Received host connection id", message.data)
      this.hostConnectionId = message.data
    }
  }


}
