import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsComponent } from './details.component';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetailsComponent,
      },
    ]),
  ],
})
export class DetailsModule {}
