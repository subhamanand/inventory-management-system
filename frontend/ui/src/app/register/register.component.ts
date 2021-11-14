import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  constructor(private http: HttpClient,private router:Router) { }

  email : string;
  password : string;
  country : string;
  phone : string;
  age : string;
  name: string;
  userData = {}


  onSubmit(){
    this.userData = 
    {
    "email":this.email,
    "password":this.password,
    "phone": this.phone,
    "age":this.age,
    "country":this.country,
    "name":this.name
    };



    this.http.post(environment.backendApiUrl+'register', this.userData).subscribe(data => {
      this.router.navigate(["login"]);
    })
  }
  
}
