import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, collection, collectionData, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private firestore: Firestore, private toastr: ToastrService) { }

  addCategory(categoryData: any) {
    const categoriesInstance = collection(this.firestore, 'categories');
    addDoc(categoriesInstance, categoryData)
      .then((docRef) => {
        console.log(docRef);
        this.toastr.success('Category added successfully...!');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCategories(){
    const categoriesInstance = collection(this.firestore, 'categories');
    return collectionData(categoriesInstance, { idField : 'id' });
  }

  updateCategory(id: string, updatedCategory: string){
    const docInstance = doc(this.firestore, 'categories', id);
    let categoryData = {
      category: updatedCategory,
    };
    updateDoc(docInstance, categoryData)
    .then(() => {
      this.toastr.success('Category updated successfully...!')
    })
    .catch((err) => {
      console.log(err);
    });
  }

  deleteCategory(id: string){
    const docInstance = doc(this.firestore, 'categories', id);
    deleteDoc(docInstance)
    .then(() => {
      this.toastr.success('Category deleted successfully...!')
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
