import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';


const appRoutes: Routes = [
    { path: '', component: LoginComponent } ,
    { path: 'login', component: LoginComponent } ,
    { path: 'dashboard', component: DashboardComponent },
    { path: 'register', component: RegisterComponent }


]

@NgModule({

    imports: [
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload'
          })
    ],
    exports: [
        RouterModule
    ]

})

export class AppRoutingModule{

}