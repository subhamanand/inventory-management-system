import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private http: HttpClient,private router:Router) { }

  public email : string;
  public password : string;
  public country : string;
  public phone : string;
  public age : string;
  public name: string;
  userData = {}

  ngOnInit(): void {
  
  }

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
      
      console.log("response",data);
      
      this.router.navigate(["login"]);
            
            })
  }
  
}
