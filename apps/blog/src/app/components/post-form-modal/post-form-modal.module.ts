import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EnumSelectModule } from '../enum-select/enum-select.module';
import { PostFormModalComponent } from './post-form-modal.component';

@NgModule({
  declarations: [PostFormModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzAlertModule,
    EnumSelectModule,
    NzSelectModule,
    NzButtonModule,
  ],
  exports: [PostFormModalComponent],
})
export class PostFormModalModule {}
