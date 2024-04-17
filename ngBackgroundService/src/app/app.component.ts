import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngBackgroundService';

  baseUrl = "https://localhost:7286/api/";
  accountBaseUrl = this.baseUrl + "Account/";

  constructor(public http: HttpClient, public cookieService: CookieService){}

  async register(){
    let registerData = {
      username: "Autre",
      email : "autre2@test.com",
      password : "Passw0rd!",
      passwordConfirm : "Passw0rd!",
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Register', registerData));
    console.log(result);
  }

  async connect(){
    let registerData = {
      username : "autre2@test.com",
      password : "Passw0rd!"
    }
    let result = await lastValueFrom(this.http.post<any>(this.accountBaseUrl + 'Login', registerData));
    console.log(result);
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
    console.log(result);
  }

  isLoggedIn(){
    return this.cookieService.get(".AspNetCore.Identity.Application");
  }
}
