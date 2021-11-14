import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient,private router:Router) { }

  email : string
  password : string
  credentialStatus : number;
  loginCreds = {}
  wrongCredentials:boolean=false;

 

  onSubmit(){
    this.loginCreds = {"username":this.email,"password":this.password};
    this.http.post(environment.backendApiUrl+'login', this.loginCreds).subscribe(data => {
        this.credentialStatus = data['status'];
        if(this.credentialStatus == 200){
          localStorage.setItem('token', data['encodedData']);
          this.router.navigate(["dashboard"]);
        }
        else
        {
          this.wrongCredentials=true;
        }               
    })
  }
  
  goToRegisterPage()
  {
    this.router.navigate(["register"]);
  }
}
