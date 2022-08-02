import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'blog';

  ngOnInit() {
    console.log('test');
  }
}
