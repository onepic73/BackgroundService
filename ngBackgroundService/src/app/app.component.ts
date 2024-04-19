import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// On doit commencer par ajouter signalr dans les node_modules: npm install @microsoft/signalr
// Ensuite on inclut la librairie
import * as signalR from "@microsoft/signalr"

const CONNECTION_LOCALSTORAGE_KEY = "connected";

interface RoundResult{
  winners:string[],
  nbClicks:number
}

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
  nbClicks = 0;
  private hubConnection?: signalR.HubConnection

  constructor(public http: HttpClient){}

  async register(){
    let registerData = {
      username: "Autre4",
      email : "autre4@test.com",
      password : "Passw0rd!",
      passwordConfirm : "Passw0rd!",
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
    console.log(result);
  }

  async login(){
    let registerData = {
      username : "Autre4",
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

  Increment() {
    this.nbClicks++;
    this.hubConnection!.invoke('Increment')
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
        this.hubConnection!.on('EndRound', (data:RoundResult) => {
          this.nbClicks = 0;
          if(data.nbClicks > 0){
            let phrase = " a gagné avec ";
            if(data.winners.length > 1)
              phrase = " ont gagnées avec "
            alert(data.winners.join(", ") + phrase + data.nbClicks + " clicks!");
          }
          else{
            alert("Aucun gagnant...");
          }

        });
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }
}
