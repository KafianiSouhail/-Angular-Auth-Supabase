import { Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { MyRoutes } from "./types/interfaces/my-routes.enum";
import { AuthGuard } from "./guards/auth.guard";

export const routes:Routes = [
    {
        path:'', 
        component:AuthComponent, 
        children:[
            {path:MyRoutes.LOGIN, component:LoginComponent},
            {path:MyRoutes.REGISTER, component:RegisterComponent},
            {path:MyRoutes.PROFILE, component:ProfileComponent, canActivate:[AuthGuard]}
        ]
    }
]