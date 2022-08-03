import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EnumToObjectPipe } from './enum-to-object.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [EnumToObjectPipe],
  exports: [EnumToObjectPipe],
})
export class EnumToObjectPipeModule {}
