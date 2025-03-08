import { Injectable, signal, Signal } from '@angular/core';
import { createSupabaseClient } from '../helpers/supabase-helper';
import { exhaustMap, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { AuthError, AuthResponse, UserResponse } from '@supabase/supabase-js';
import { MyRoles } from '../types/interfaces/my-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser = signal<{email:string, role:MyRoles} | null>(null);

  private readonly supabaseClient = createSupabaseClient();

  constructor(){
    this.supabaseClient.auth.onAuthStateChange((event,session) => {      
      if(event === "SIGNED_IN") {
        const email = session?.user?.email!;
        this.currentUser.set({email,role:MyRoles.USER})
        this.setCurrentUser(email)
      }
      else if(event === "SIGNED_OUT") {
        this.currentUser.set(null);
      }
    })
  }

  public setCurrentUser(email:string):void{
    from(this.supabaseClient.auth.getUser()).pipe(mergeMap((user) => {
      const promise = this.supabaseClient.from("profiles").select("*").eq("id",user.data.user?.id).single()
      return from(promise)
    })).subscribe(response => {
      this.currentUser.set({email, role:response.data.role})
    })
  }

  public register(email:string,password:string):Observable<AuthResponse>{
    const promise = this.supabaseClient.auth.signUp({
      email,
      password
    })
    return from(promise);
  }

  public setProfile(role:MyRoles):Observable<any>{
    return from(this.supabaseClient.auth.getUser()).pipe(
      switchMap(user => {
        const promise = this.supabaseClient.from("profiles").insert({id:user.data.user?.id,role}).single()
        console.log("returning promise");
        
        return from(promise)
      })
    )
    
  }

  public login(email:string,password:string):Observable<AuthResponse>{
    const promise = this.supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    return from(promise);
  }

  public  logout():void{
    this.supabaseClient.auth.signOut();
  }
}
