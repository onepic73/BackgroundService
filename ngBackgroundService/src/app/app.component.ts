import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// On doit commencer par ajouter signalr dans les node_modules: npm install @microsoft/signalr
// Ensuite on inclut la librairie
import * as signalR from "@microsoft/signalr"

const CONNECTION_LOCALSTORAGE_KEY = "connected";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngBackgroundService';

  baseUrl = "https://localhost:7056/";
  apiBaseUrl = this.baseUrl + "api/"
  accountBaseUrl = this.apiBaseUrl + "Account/";

  isConnected = false;
  private hubConnection?: signalR.HubConnection

  constructor(public http: HttpClient){}

  async register(){
    let registerData = {
      username: "Autre3",
      email : "autre3@test.com",
      password : "Passw0rd!",
      passwordConfirm : "Passw0rd!",
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
    console.log(result);
  }

  async login(){
    let registerData = {
      username : "Autre3",
      password : "Passw0rd!"
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));
    console.log(result);
    localStorage.setItem(CONNECTION_LOCALSTORAGE_KEY, "oui");
  }

  async privateRequest(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'PrivateData'));
    console.log(result);
  }

  async publicRequest(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'PublicData'));
    console.log(result);
  }

  async logout(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'Logout'));
    localStorage.removeItem(CONNECTION_LOCALSTORAGE_KEY);
    console.log(result);
  }

  isLoggedIn(){
    return localStorage.getItem(CONNECTION_LOCALSTORAGE_KEY) != null;
  }

  connectToHub() {
    // TODO On doit commencer par créer la connexion vers le Hub
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(this.baseUrl + 'game')
                              .build();
    // TODO On se connecte au Hub
    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        // Une fois connectée, on peut commencer à écouter pour les messages que l'on va recevoir du serveur
        /*this.hubConnection!.on('UsersList', (data) => {
          this.usersList = data;
        });

        this.hubConnection!.on('ChannelsList', (data) => {
          this.channelsList = data;
        });

        this.hubConnection!.on('NewMessage', (message) => {
          this.messages.push(message);
        });

        this.hubConnection!.on('LeaveChannel', (message) => {
          this.selectedChannel = null;
        });*/
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }
}
