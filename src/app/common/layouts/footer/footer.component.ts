import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number=new Date().getFullYear();
  linkedinProfileUrl: string = "#";

  constructor(private configService: ConfigService){}
  
  ngOnInit(): void {
    this.linkedinProfileUrl = this.configService.getLinkedinProfileURL();
  }
}
