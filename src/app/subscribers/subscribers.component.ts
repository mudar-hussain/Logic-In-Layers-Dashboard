import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css'],
})
export class SubscribersComponent implements OnInit {
  subscribersList!: Observable<any>;

  constructor(private subscriberService: SubscribersService) {}

  ngOnInit(): void {
    this.subscribersList = this.subscriberService.getSubscribers();
  }

  deleteSubscriber(subsId: string) {
    this.subscriberService.deleteSubscriber(subsId);
  }
}
