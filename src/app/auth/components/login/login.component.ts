import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MyRoutes } from '../../types/interfaces/my-routes.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  public form:FormGroup;
  public errorMsg:string;

  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.form = this.initializeForm();
  }

  initializeForm():FormGroup{
    return this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  onSubmit():void{
    if(this.form.invalid) return;
    const {email,password} = this.form.getRawValue();
    this.authService.login(email, password).subscribe(response => {
      if(response.error){
        this.errorMsg = response.error.message;
      }
      else{
        this.router.navigateByUrl(`/auth/${MyRoutes.PROFILE}`);
      }
    }) 
  }

}
