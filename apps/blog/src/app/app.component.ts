import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'serverless-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'blog';

  ngOnInit() {
    console.log('test');
  }
}
