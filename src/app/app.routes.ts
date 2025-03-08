import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'', pathMatch:'full', redirectTo:'/auth/profile'},
    {
        path:'auth', 
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    }
];
