import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'blog-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  public isCollapsed: boolean = true;

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  public toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
