import { Injectable, signal, Signal } from '@angular/core';
import { createSupabaseClient } from '../helpers/supabase-helper';
import { from, Observable } from 'rxjs';
import { AuthError, AuthResponse } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser = signal<{email:string} | null>(null);

  private readonly supabaseClient = createSupabaseClient();

  constructor(){
    this.supabaseClient.auth.onAuthStateChange((event,session) => {      
      if(event === "SIGNED_IN") {
        const email = session?.user?.email!;
        this.currentUser.set({email})
      }
      else if(event === "SIGNED_OUT") {
        this.currentUser.set(null);
      }
    })
  }

  public register(email:string,password:string):Observable<AuthResponse>{
    const promise = this.supabaseClient.auth.signUp({
      email,
      password
    })

    return from(promise);
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
