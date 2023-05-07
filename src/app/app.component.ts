import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router'
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Questionnaire';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  userDocument: UserDocument  | null = null;
  constructor(private loginSheet: MatBottomSheet,
      private router: Router
    ){
    this.auth.listenToSignInStateChanges(
      user => {
        if(user){
          this.auth.checkSignInState(
            {
              whenSignedIn: user =>{
                
              },
              whenSignedOut: user =>{
                
              },
              whenSignedInAndEmailNotVerified: user => {
                this.router.navigate(["emailVerification"])
              },
              whenSignedInAndEmailVerified: user =>{
                this.getUserProfile();
              },
              whenChanged: user =>{

              }
            }
          );
        }
      }
    );

  }
getUserProfile(){
  this.firestore.listenToDocument(
    {
      name: "Getting Document",
      path: ["Users", this.auth.getAuth().currentUser!.uid],
      onUpdate: (result) => {
        this.userDocument = <UserDocument>result.data();
        
        this.userHasProfile = result.exists;
        if(this.userHasProfile){
          this.router.navigate(["myfeed"])
        }
        
      }
    }
  );
}

onLogoutClick(){
  this.auth.signOut();
  this.router.navigate([""]);
}

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
     this.loginSheet.open(AuthenticatorComponent);
  }
  onHomeClick(){
    this.router.navigate([""])
  }
  onMyFeedClick(){
    this.router.navigate(["myfeed"])
  }
}
export interface UserDocument{
  publicName: string;
  description: string;
}
