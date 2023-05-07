import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateFormComponent } from 'src/app/tools/create-form/create-form.component';
import { FirebaseTSFirestore, OrderBy, Limit, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
interface Question {
  text: string;
}
interface AnsweredQuestion {
  text: string;
  answer: string;
}
@Component({
  selector: 'app-my-feed',
  templateUrl: './my-feed.component.html',
  styleUrls: ['./my-feed.component.css']
})
export class MyFeedComponent {
  firestore = new FirebaseTSFirestore();
  forms: FormData [] = [];
  answeredMode:boolean = false;
  editMode:boolean = false;
  auth = new FirebaseTSAuth();
  constructor(private dialog: MatDialog){
    this.editMode=false;
  }
  ngOnInit(): void {
   this.loadCurrentFeed();
   this.editMode=false;
   
  }
  


  onCreateFormClick(){
    this.dialog.open(CreateFormComponent);
  }
  getForms(){
    this.forms=[];
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(20)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let form = <FormData>doc.data();
              form.formId = doc.id;
              this.forms.push(form)
            }
          );
        },
        onFail: err => {

        }
      }
    );
  }
  getOwnForms(){
    this.forms=[];
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          
          new OrderBy("timestamp", "desc"),
          new Limit(20)
        ],
        onComplete: (result) => {
          
          result.docs.forEach(
            doc => {
              let form = <FormData>doc.data();
              form.formId = doc.id;
              if(form.creatorId==this.auth.getAuth().currentUser?.uid){
                this.forms.push(form)
              }
              
            }
          );
        },
        onFail: err => {
          
        }
      }
    );
    
  }
  getFormsAnswered(){
    this.forms=[];
    let answeredForms: string[] = [];
    this.firestore.getCollection(
      {
        path: ["AnsweredForms"],
        where: [
          
          new OrderBy("timestamp","desc"),
          new Limit(100)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {              
              let form = <AnsFormData>doc.data();        
              answeredForms.push(form.sourceForm);
            }
          );
        },
        onFail: err => {

        }
      }
    );
    this.firestore.getCollection(
      {
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(20)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let form = <FormData>doc.data();
              form.formId = doc.id;
              if(answeredForms.includes(form.formId)){
                this.forms.push(form)
              }
              
            }
          );
        },
        onFail: err => {

        }
      }
    );
  }
  deleteForm(form: FormData){
    let deleteId = form.formId;
        this.firestore.delete({
      path: ["Posts", deleteId],
      onComplete: () => {
        this.loadCurrentFeed();
      } 
    })
  }
  
  answerMode(){
    this.answeredMode= !this.answeredMode;
    this.editMode=false;
    this.loadCurrentFeed();
  }
  loadCurrentFeed(){
    if(this.editMode){
      
      this.getOwnForms();
      
    }else{
      
      if(this.answeredMode){
        this.getFormsAnswered();
      }else{
        this.getForms();
      }
    }
    
  }
  switchEditMode(){
    this.editMode= true;
    this.loadCurrentFeed();
  }
  editOff(){
    this.editMode=false;
    this.answeredMode=false;
    this.loadCurrentFeed();
  }
}


export interface FormData{
  comment: string;
  creatorId: string;
  imageUrl?:string;
  formId: string;
  questions: Question[];
}export interface AnsFormData{
  creatorId: string;
  sourceForm: string;
  questions: AnsweredQuestion[];
  formId: string;
}
