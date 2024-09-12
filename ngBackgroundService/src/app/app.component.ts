import { AccountService } from './services/account.service';
import { Component, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';

// On doit commencer par ajouter signalr dans les node_modules: npm install @microsoft/signalr
// Ensuite on inclut la librairie
import * as signalR from "@microsoft/signalr"

interface RoundResult{
  winners:string[],
  nbClicks:number
}

interface GameInfo{
  multiplierCost:number,
  nbWins:number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngBackgroundService';

  baseUrl = environment.apiUrl;

  nbWins = 0;

  private hubConnection?: signalR.HubConnection

  isConnected = false;
  nbClicks = 0;
  multiplierInitialCost = 0
  multiplierCost = 0;
  multiplier = 1;

  constructor(public account:AccountService, private zone: NgZone){
  }

  Increment() {
    this.nbClicks += this.multiplier;
    this.hubConnection!.invoke('Increment')
  }

  BuyMultiplier() {
    if(this.nbClicks >= this.multiplierCost)
    {
      this.hubConnection!.invoke('BuyMultiplier');
      this.nbClicks -= this.multiplierCost;
      this.multiplier *= 2;
      this.multiplierCost *= 2;
    }
  }

  async register(){
    try{
      await this.account.register();
    }
    catch(e){
      alert("Erreur pendant l'enregistrement!!!!!");
      return;
    }
    alert("L'enregistrement a été un succès!");
  }

  async login(){
    await this.account.login();
  }

  async logout(){
    await this.account.logout();

    if(this.hubConnection?.state == signalR.HubConnectionState.Connected)
      this.hubConnection.stop();
    this.isConnected = false;
  }

  isLoggedIn() : Boolean{
    return this.account.isLoggedIn();
  }

  connectToHub() {
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl(this.baseUrl + 'game', { accessTokenFactory: () => localStorage.getItem("token")! })
                              .build();

    if(!this.hubConnection)
      return;

    this.hubConnection.on('GameInfo', (data:GameInfo) => {
      console.log("Received GameInfo");
      this.zone.run(() => {
        console.log(data);
        this.isConnected = true;
        this.multiplierInitialCost = data.multiplierCost;
        this.multiplierCost = this.multiplierInitialCost;
        this.nbWins = data.nbWins;
      });
    });

    this.hubConnection.on('EndRound', (data:RoundResult) => {
      console.log("Received EndRound");
      this.zone.run(() => {
        console.log(data);
        this.nbClicks = 0;
        this.multiplierCost = this.multiplierInitialCost;
        this.multiplier = 1;

        if(data.winners.indexOf(this.account.username) >= 0)
          this.nbWins++;

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
    });

    this.hubConnection
      .start()
      .then(() => {
        console.log("Connected to Hub");
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }
}
