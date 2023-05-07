import { Component, Input, OnInit} from '@angular/core';
import { FormData } from 'src/app/pages/my-feed/my-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { UserDocument } from 'src/app/app.component';
import { FillOutComponent } from '../fillout/fill-out/fill-out.component';
import { MatDialog } from '@angular/material/dialog';
interface Question{
  text: string;
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Input() formData?: FormData;
  creatorName?: string;
  creatorDescription?: string;
  firestore = new FirebaseTSFirestore();
  questions: Question[] =[];
  
  constructor(private dialog: MatDialog){
    
  }
  ngOnInit(): void{
    this.getCreatorInfo();
  }

  onFilloutClick() {
    const dialogRef = this.dialog.open(FillOutComponent, {
      data: { formId: this.formData?.formId }
    });
  }
  
  getCreatorInfo(){
    this.firestore.getDocument(
      {
        path: ["Users", this.formData!.creatorId],
        onComplete: result => {
          let userDocument = <UserDocument>result.data();
          this.creatorName =  userDocument.publicName;
          this.creatorDescription = userDocument.description;
          
        }
      }
    );
  }
}
