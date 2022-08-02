import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  constructor(private _postsService: PostService) {}

  ngOnInit(): void {
    this._postsService.findPosts().subscribe((results) => {
      if (results.data) {
        this.posts$.next(results.data);
      } else {
        this.errorMessage = 'Error during fetch!';
      }
    });
  }
}
