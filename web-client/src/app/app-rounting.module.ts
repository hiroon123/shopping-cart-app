import { NgModule } from "@angular/core";
import { Routes,RouterModule } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AccountVerifyComponent } from "./components/shared/account-verify/account-verify.component";
import { PageNotFoundComponent } from "./components/shared/page-not-found/page-not-found.component";
import { RegisterSuccessComponent } from "./components/shared/register-success/register-success.component";
import { ShoppingCartComponent } from "./components/shopping-cart/shopping-cart.component";

const routes:Routes = [
    { path: '', redirectTo: '/shop', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'shop', component: ShoppingCartComponent },
    { path: 'register-success', component: RegisterSuccessComponent},
    { path: 'account-verify', component:AccountVerifyComponent},
    { path: '**', component:PageNotFoundComponent }
]

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports:[
        RouterModule
    ]
})
export class AppRoutingModule{

}