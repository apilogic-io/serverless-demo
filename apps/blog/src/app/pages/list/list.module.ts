import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { PostFormModalModule } from '../../components/post-form-modal/post-form-modal.module';
import { ListComponent } from './list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent,
      },
    ]),
    NzListModule,
    PostFormModalModule,
  ],
})
export class ListModule {}
