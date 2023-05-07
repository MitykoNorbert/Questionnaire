import { Component } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSStorage} from 'firebasets/firebasetsStorage/firebaseTSStorage';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { MatDialogRef } from '@angular/material/dialog';

interface Question {
  text: string;
}
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent {
  selectedImageFile: File | null;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();
  questions: Question[];
  constructor(private dialog: MatDialogRef<CreateFormComponent>){
    this.selectedImageFile = null;
    this.questions = [{text: ''}];
  }

  onPostClick(commentInput: HTMLTextAreaElement){
    
    let comment = commentInput.value; 
    if(comment.length <= 0) return;
    if(this.selectedImageFile){
      this.uploadImagePost(comment);
    }else{
      this.uploadForm(comment);
    }
    
}
uploadImagePost(comment: string){
  let postId = this.firestore.genDocId();
  const currentUser = this.auth.getAuth().currentUser;
  if (!currentUser) return;
  this.storage.upload(
    {
      uploadName: "upload Image Post",
      path: ['Posts', postId, 'image'],
      data: {
        data: this.selectedImageFile
      },
      onComplete: (downloadUrl) => {
        this.firestore.create(
          {
            path: ["Posts", postId],
            data: {
              comment: comment,
              creatorId: this.auth.getAuth().currentUser?.uid,
              imageUrl: downloadUrl,
              timestamp: FirebaseTSApp.getFirestoreTimestamp(),
              questions: this.questions.map((question) => ({ text: question.text }))
            },
            onComplete: (docId) => {
              this.dialog.close();
            }
          }
        );

      
        
        
      },
      onFail: (err) => {
        alert(err);
      }
    }
  );
}
uploadForm(comment: string) {
  let postDocId=this.firestore.genDocId();
  const currentUser = this.auth.getAuth().currentUser;
  if (!currentUser) return;


  // Create a Firestore document for each question
  this.firestore.create(
    {
      path: ["Posts"],
      data: {
        comment: comment,
        creatorId: this.auth.getAuth().currentUser?.uid,
        timestamp: FirebaseTSApp.getFirestoreTimestamp(),
        questions: this.questions.map((question) => ({ text: question.text }))
      },
      onComplete: (docId) => {
        this.dialog.close();
      }
    }
  );
  

  this.dialog.close();
}
/*uploadForm(comment: string){
  const currentUser = this.auth.getAuth().currentUser;
  if (!currentUser) return
  this.firestore.create(
    {
      path: ["Posts"],
      data: {
        comment: comment,
      creatorId: this.auth.getAuth().currentUser?.uid,
      timestamp: FirebaseTSApp.getFirestoreTimestamp()
      },
      onComplete: (docId) => {
        this.dialog.close();
      }
    }
  );
}*/

  onPhotoSelected(photoSelector: HTMLInputElement){
    this.selectedImageFile = photoSelector.files && photoSelector.files[0];
    let fileReader = new FileReader();
    if(this.selectedImageFile ==null) return;
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener(
      "loadend",
      ev => {
        let readableString = fileReader.result!.toString();
        let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
        postPreviewImage.src = readableString;
      
      }
    );
    
  }
  addQuestion() {
    this.questions.push({ text: '' });
  }
  removeQuestion(){
    this.questions.pop();
  }
}
