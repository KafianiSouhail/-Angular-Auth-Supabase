import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyRoutes } from '../../types/interfaces/my-routes.enum';
import { MyRoles } from '../../types/interfaces/my-roles.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports:[ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  public form!:FormGroup;
  public errorMsg:string = '';

  private readonly authService = inject(AuthService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)

  ngOnInit() {
    this.form = this.initializeForm();
  }

  initializeForm():FormGroup{
    return this.formBuilder.nonNullable.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]],
      role:[MyRoles.USER, Validators.required]
    })
  }

  onSubmit():void{
    if(this.form.invalid) return;

    const {email,password,role} = this.form.getRawValue();
    this.authService.register(email,password).subscribe(response => {
      if(response.error){        
        this.errorMsg = response.error.message;
      }
      else{
        this.errorMsg = '';
        this.authService.setProfile(role).subscribe(response => {
          this.form.reset();
          this.router.navigate(['auth',MyRoutes.PROFILE])
        })
       
      }
    })
  }

}
