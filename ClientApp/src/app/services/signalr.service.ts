import { Injectable, Inject } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public hubConnection!: signalR.HubConnection
  public dataHistory: string[] = [];
  public dataReceived: Subject<string> = new Subject<string>();
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

    this.hubConnection.on('transferdata', (data:any) => {
      console.log('data received', data);
      this.dataHistory.push(data)
      this.dataReceived.next(data)
    });
  }

  private async getConnectionId() {
    const data = await this.hubConnection.invoke('getconnectionid')
    console.log(data);
    this.connectionId = data;
  }

  public sendToHost = (data: string) => {
    console.log("sending to host", "data", data)
    this.hubConnection.invoke('sendtohost', data)
      .catch((err:any) => console.error(err));
  }

  public sendToGroup = (data: string) => {
    console.log("sending to group", "data", data)
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
}
