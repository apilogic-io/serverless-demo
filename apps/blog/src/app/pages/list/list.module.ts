import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { ListComponent } from './list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent,
      },
    ]),
    NzListModule,
  ],
})
export class ListModule {}
