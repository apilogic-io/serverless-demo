import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EnumToObjectPipeModule } from '../../pipes/enum-to-object/enum-to-object-pipe.module';
import { EnumSelectComponent } from './enum-select.component';

@NgModule({
  declarations: [EnumSelectComponent],
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule, EnumToObjectPipeModule],
  exports: [EnumSelectComponent],
})
export class EnumSelectModule {}
