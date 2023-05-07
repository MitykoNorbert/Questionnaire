import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy, Limit, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormData } from 'src/app/pages/my-feed/my-feed.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

interface AnsweredQuestion{
  text: string;
  answer: string;
}
@Component({
  selector: 'app-fill-out',
  templateUrl: './fill-out.component.html',
  styleUrls: ['./fill-out.component.css']
})
export class FillOutComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  title: string;
  formId: string;
  questions: AnsweredQuestion[]=[];
  auth = new FirebaseTSAuth();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { formId: string},
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialogRef<FillOutComponent>
  ) {
    

    this.title = "Form Title";
    this.formId = data.formId;
  }

  ngOnInit(): void {
    this.firestore.getDocument(
      {
        path: ["Posts", this.formId],
        onComplete: result => {
          let selectedForm = <FormData>result.data();
          let selectedformId = selectedForm.formId;
          this.title=selectedForm.comment;
          selectedForm.questions.forEach(question => {
            let newQuestion: AnsweredQuestion = { text: question.text, answer: "" };
            this.questions.push(newQuestion);
          });
                    
        },
        onFail: err => {
          
        }
      }
    );
    
    
    
  }
  onSubmitClick() {
    let answers = this.questions.map(question => question.answer);
    console.log(answers);
    this.uploadAnsweredForm();
  }
  uploadAnsweredForm() {
    let customID=this.auth.getAuth().currentUser?.uid+this.formId;
    const currentUser = this.auth.getAuth().currentUser;
    if (!currentUser) return;
  
  
    // Create a Firestore document for each question
    this.firestore.create(
      {
        path: ["AnsweredForms",customID],
        data: {
          sourceForm: this.formId,
          creatorId: this.auth.getAuth().currentUser?.uid,
          timestamp: FirebaseTSApp.getFirestoreTimestamp(),
          questions: this.questions.map((question) => ({ text: question.text, answer: question.answer }))
        },
        onComplete: (docId) => {
          this.dialog.close();
        }
      }
    );
    
  
    this.dialog.close();
  }
  
  
  
  
  
}
