import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'
@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;
  constructor(private bottomSheetRef: MatBottomSheetRef){
    this.firebasetsAuth = new FirebaseTSAuth();
  }
  ngOnInit(): void {

  }
  onResetClick(resetEmaill: HTMLInputElement){
    let email = resetEmaill.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email:email,
          onComplete: (err) =>{
            this.bottomSheetRef.dismiss();
            //alert(`A jelszóvisszaállító e-mail elküldve a ${email} címre`);
          }
        }
      );
    }
  }
  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
    ){
      let email = loginEmail.value;
      let password = loginPassword.value;

      if(this.isNotEmpty(email) && this.isNotEmpty(password)){
        this.firebasetsAuth.signInWith(
          {
            email: email,
            password: password,
            onComplete: (uc) => {
              this.bottomSheetRef.dismiss();
              //alert("Sikeres Belépés!")
            },
            onFail: (err) => {
              alert(err);
            }
          }
        );
      }
  }
  onRegisterClick(
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ){
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;
    
    if(
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password,confirmPassword)
    ){
      this.firebasetsAuth.createAccountWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.bottomSheetRef.dismiss();
          },
          onFail: (err) => {
            alert("Nem sikerült regisztrálni.")
          }
        }
  
      );
    }
    
  }
  isNotEmpty(text: string){
  return text != null && text.length>0;
  }
  isAMatch(text: string, text2: string){
    return text==text2;
  }
  onForgotPasswordClick(){
    this.state=AuthenticatorCompState.FORGOT_PASSWORD
  }

  onCreateAccountClick(){
    this.state=AuthenticatorCompState.REGISTER
  }
  onLoginClick(){
    this.state=AuthenticatorCompState.LOGIN
  }

  isLoginState(){
    return this.state==AuthenticatorCompState.LOGIN
  }
  isRegisterState(){
    return this.state==AuthenticatorCompState.REGISTER
  }
  isForgotPasswordState(){
    return this.state==AuthenticatorCompState.FORGOT_PASSWORD
  }
  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "Bejelentkezés"
      case AuthenticatorCompState.REGISTER:
        return "Regisztráció"
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Jelszó visszaállítása"
      }
  }

}
export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
