import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from 'src/app/tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  auth=new FirebaseTSAuth();
  constructor(private loginSheet: MatBottomSheet,
    private router:Router ) { }
  ngOnInit(): void {

  }
  onGetStartedClick(){
      if(this.auth.getAuth().currentUser){
        this.router.navigate(["myfeed"]);
      }else{
       this.loginSheet.open(AuthenticatorComponent) 
      }
      
  }
}
