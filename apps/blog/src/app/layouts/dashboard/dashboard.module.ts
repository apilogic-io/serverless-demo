import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import { HomeOutline } from '@ant-design/icons-angular/icons';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzImageModule } from 'ng-zorro-antd/experimental/image';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DashboardComponent } from './dashboard.component';

const icons: IconDefinition[] = [HomeOutline];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzIconModule.forChild(icons),
    NzTypographyModule,
    NzMenuModule,
    NzDrawerModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          {
            path: '',
            redirectTo: '/posts',
            pathMatch: 'full',
          },
          {
            path: 'posts',
            loadChildren: () => import('../../pages/list/list.module').then((m) => m.ListModule),
          },
          {
            path: 'post/:postId',
            loadChildren: () => import('../../pages/details/details.module').then((m) => m.DetailsModule),
          },
        ],
      },
    ]),
    NzDividerModule,
    NzSpaceModule,
    NzToolTipModule,
    NzImageModule,
  ],
})
export class DashboardModule {}
