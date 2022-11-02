import { Injectable, Inject } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public hubConnection!: signalR.HubConnection
  public dataHistory: any[] = [];
  public dataReceived: Subject<any> = new Subject<any>();
  public connectionId: string = "";

  constructor(@Inject('BASE_URL') private baseUrl: string) { }

  public async startConnection() {
    // if (this.hubConnection && this.hubConnection.state === "Connected") {
    //   TODO: handle case when connection is already established
    // }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}quizhub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    await this.hubConnection.start();

    await this.getConnectionId()

    this.hubConnection.on('transferdata', (data:string, senderConnectionId:string = "") => {
      let parsedData = JSON.parse(data);
      parsedData.senderConnectionId = senderConnectionId
      this.dataHistory.push(JSON.stringify(parsedData))
      this.dataReceived.next(parsedData)
    });
  }

  private async getConnectionId() {
    const data = await this.hubConnection.invoke('getconnectionid')
    this.connectionId = data;
  }

  public sendToHost = (data: string) => {
    this.hubConnection.invoke('sendtohost', data)
      .catch((err:any) => console.error(err));
  }

  public sendToPlayer = (data: string, playerConnectionId: string) => {
    this.hubConnection.invoke('sendtoplayer', data, playerConnectionId)
      .catch((err:any) => console.error(err));
  }

  public sendToGroup = (data: string) => {
    this.hubConnection.invoke('sendtogroup', data)
      .catch((err:any) => console.error(err));
  }

  public hostQuiz = () => {
    this.hubConnection.invoke('hostquiz')
      .catch((err:any) => console.error(err));
  }

  public joinQuiz = (groupName: string, playerName: string) => {
    this.hubConnection.invoke('joinquiz', groupName, playerName)
      .catch((err:any) => console.error(err));
  }

  public async reconnectCheck (groupName: string, playerName: string, oldConnectionId: string) {
    try {
      let result = await this.hubConnection.invoke('reconnectcheck', groupName, playerName, oldConnectionId);
      let parsedData = JSON.parse(result);
      this.dataHistory.push(result)
      this.dataReceived.next(parsedData)
    } catch (err: any) {
      console.error(err)
    }
  }

  public reconnect = (groupName: string, playerName: string, oldConnectionId: string) => {
    this.hubConnection.invoke('reconnect', groupName, playerName, oldConnectionId)
      .catch((err:any) => console.error(err));
  }
}
