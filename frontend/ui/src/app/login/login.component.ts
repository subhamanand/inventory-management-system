import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private http: HttpClient,private router:Router) { }

  public email : string
  public password : string
  credential_stat : string;
  login_creds = {}

  ngOnInit(): void {
  
  }

  onSubmit(){
    this.login_creds = {"username":this.email,"password":this.password};
    this.http.post(environment.backendApiUrl+'login', this.login_creds).subscribe(data => {

                console.log(data);
                this.credential_stat = data['status'];
                console.log(this.credential_stat);

                if(this.credential_stat === '1'){

                  localStorage.setItem('token', data['encodedData']);

                  
                    this.router.navigate(["dashboard"]);
               
                }               
            })
  }
  
  goToRegisterPage()
  {

    this.router.navigate(["register"]);

  }
}
