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

  username = "test";
  motDePasse = "Passw0rd!";

  private hubConnection?: signalR.HubConnection

  isConnected = false;
  nbClicks = 0;

  timeLeft = 0;

  constructor(public http: HttpClient){
    this.reduceTime();
  }

  reduceTime(){
    setTimeout(() => {
      this.timeLeft--;
      this.reduceTime();
    }, 1000);
  }

  async register(){
    let registerData = {
      username: this.username,
      email : this.username + "@test.com",
      password : this.motDePasse,
      passwordConfirm : this.motDePasse,
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
    console.log(result);
  }

  async login(){
    let registerData = {
      username : this.username,
      password : this.motDePasse
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));
    console.log(result);
    localStorage.setItem(CONNECTION_LOCALSTORAGE_KEY, registerData.username);
  }

  async logout(){
    let result = await lastValueFrom(this.http.get<any>(this.accountBaseUrl + 'Logout'));
    localStorage.removeItem(CONNECTION_LOCALSTORAGE_KEY);
    if(this.hubConnection?.state == signalR.HubConnectionState.Connected)
      this.hubConnection.stop();
    this.isConnected = false;
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
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(this.baseUrl + 'game')
                              .build();

                              this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        this.hubConnection!.on('EndRound', (data:RoundResult) => {
          this.nbClicks = 0;
          this.timeLeft = 30;
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
