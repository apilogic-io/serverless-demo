import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IPostList } from '../../interfaces/post-list.interface';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'blog-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  public posts$: BehaviorSubject<IPostList[]> = new BehaviorSubject<IPostList[]>([]);
  public errorMessage?: string;
  public showModal$: Subject<boolean> = new Subject();

  constructor(private _postsService: PostService) {}

  ngOnInit(): void {
    this._fetchPosts();
  }

  public openModal(): void {
    this.showModal$.next(true);
  }

  public savedPost(postId: string): void {
    setTimeout(() => {
      this._fetchPosts();
    }, 1000);
  }

  private _fetchPosts(): void {
    const subscription = this._postsService.findPosts().subscribe((results) => {
      if (results.data) {
        this.posts$.next(results.data);
      } else {
        this.errorMessage = 'Error during fetch!';
      }
      subscription.unsubscribe();
    });
  }
}
