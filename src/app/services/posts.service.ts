import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getFirestore,
  getDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  Storage,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  filePath = `${environment.defaultPostImgPath}`;
  constructor(
    private fireStorage: Storage,
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getDefaultPostImgURL() {
    const filePath = `${environment.defaultPostImgPath}`;
    const storageRef = ref(this.fireStorage, filePath);
    return getDownloadURL(storageRef);
  }

  uploadFile(file: any) {
    let downloadURL = this.getDefaultPostImgURL();
    if (file == null) return downloadURL;
    const filePath = `postImg/${Date.now()}`;
    const storageRef = ref(this.fireStorage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<any>((resolve, reject) => {
      uploadTask
        .then(() => {
          resolve(getDownloadURL(uploadTask.snapshot.ref));
        })
        .catch((error) => {
          console.log(error);
          resolve(downloadURL);
        });
    });
  }

  deletePostImg(postImgUrl: string) {
    this.getDefaultPostImgURL().then((defaultPostImgURL) => {
      if (postImgUrl == defaultPostImgURL) {
        return;
      }

      const storageRef = ref(this.fireStorage, postImgUrl);
      deleteObject(storageRef)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    });
  }

  addPost(postData: any) {
    const postInstance = collection(this.firestore, 'posts');
    addDoc(postInstance, postData)
      .then((docRef) => {
        this.toastr.success('Post created successfully...!');
        this.router.navigate(['/posts']);
      })
      .catch((err) => {
        console.log(err);
        this.deletePostImg(postData.postImgPath);
      });
  }

  getAllPosts() {
    const postInstance = collection(this.firestore, 'posts');
    return collectionData(postInstance, { idField: 'id' });
  }

  getPostById(id: string) {
    const docRef = doc(getFirestore(), 'posts', id);
    return getDoc(docRef);
  }

  updatePost(id: string, postData: any) {
    const postInstance = doc(this.firestore, 'posts', id);
    updateDoc(postInstance, postData)
      .then(() => {
        this.toastr.success('Post updated successfully...!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deletePost(postId: string, postImgUrl: string) {
    this.deletePostImg(postImgUrl);
    const postInstance = doc(this.firestore, 'posts', postId);
    deleteDoc(postInstance)
      .then(() => {
        this.toastr.success('Post deleted successfully...!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updatePostFeatured(postId: string, isFeaturedValue: boolean) {
    const postData = {
      isFeatured: isFeaturedValue,
    };
    const postInstance = doc(this.firestore, 'posts', postId);
    updateDoc(postInstance, postData)
      .then(() => {
        this.toastr.success('Post featured successfully...!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
