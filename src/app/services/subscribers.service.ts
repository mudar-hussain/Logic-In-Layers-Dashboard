import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private firestore: Firestore, private toastr: ToastrService) {}

  getSubscribers() {
    const subscribersInstance = collection(this.firestore, 'subscribers');
    return collectionData(subscribersInstance, { idField: 'id' });
  }

  deleteSubscriber(id: string) {
    const docInstance = doc(this.firestore, 'subscribers', id);
    deleteDoc(docInstance)
      .then(() => {
        this.toastr.success('Subscriber deleted successfully...!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
