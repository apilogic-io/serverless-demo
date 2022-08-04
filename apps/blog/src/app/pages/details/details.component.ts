import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription, tap } from 'rxjs';
import { authors } from '../../consts/authors.const';
import { IComment, IPost } from '../../interfaces/post.interface';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'serverless-demo-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  public post?: IPost;
  public inputValue: string = '';
  public submitting: boolean = false;
  public comments: IComment[] = [];

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
              if (result.data?.comments) {
                this.comments.push(result.data?.comments.map((comment: IComment) => comment));
              }
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

  public handleSubmit(): void {
    this.submitting = true;
    const comment: IComment = {
      body: this.inputValue,
      author: authors[0],
    };
    if (this.post?.id) {
      this._service
        .addComment(comment, this.post?.id)
        .pipe(
          tap((response) => {
            this.comments = [...this.comments, comment];
            this.inputValue = '';
          }),
          finalize(() => (this.submitting = false))
        )
        .subscribe();
    }
  }
}
