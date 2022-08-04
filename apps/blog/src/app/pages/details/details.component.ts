import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { IPost } from '../../interfaces/post.interface';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'serverless-demo-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  public post?: IPost;

  private _subscription?: Subscription;

  constructor(private _route: ActivatedRoute, private _service: PostService) {}

  ngOnInit(): void {
    const postId = this._route.snapshot.paramMap.get('postId');
    if (postId) {
      this._subscription = this._service
        .getPostById(postId)
        .pipe(
          tap((result) => {
            if (result.data) {
              this.post = result.data;
            }
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
