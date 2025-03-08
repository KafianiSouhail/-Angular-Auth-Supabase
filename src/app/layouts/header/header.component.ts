import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MyRoutes } from '../../auth/types/interfaces/my-routes.enum';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports:[RouterModule]
})
export class HeaderComponent implements OnInit {
  public myRoutes:typeof MyRoutes = MyRoutes;
  public currentUser = signal<{email:string} | null>(null)

  private readonly authservice = inject(AuthService)
  private readonly router = inject(Router)
  ngOnInit() {
    this.currentUser = this.authservice.currentUser;
  }

  onLogout():void{
    this.authservice.logout();
    this.router.navigate(['auth',MyRoutes.LOGIN])
  }

}
