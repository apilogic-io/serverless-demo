import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { concatMap, of, Subject, tap } from 'rxjs';
import { authors } from '../../consts/authors.const';
import { PostStatuses } from '../../enums/post-statuses.enum';
import { IPostList } from '../../interfaces/post-list.interface';
import { IAuthor, IPost } from '../../interfaces/post.interface';
import { IServerResponse } from '../../interfaces/server-response.interface';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'post-form-modal',
  templateUrl: './post-form-modal.component.html',
  styleUrls: ['./post-form-modal.component.less'],
})
export class PostFormModalComponent implements OnInit {
  @Input() showModal$: Subject<boolean> = new Subject();
  @Input() postInput$!: Subject<IPostList>;

  @Output() savedPost: EventEmitter<string> = new EventEmitter<string>();

  public isVisible: boolean = false;
  public form!: FormGroup;
  public errorMessage?: string;
  public authors: IAuthor[] = authors;
  public postStatuses = PostStatuses;
  public loading: boolean = false;

  constructor(private _fb: FormBuilder, private _service: PostService) {}

  ngOnInit(): void {
    this._initForm();
    this.showModal$.subscribe((value) => {
      this.isVisible = value;
    });
    this.loadPost();
  }

  private loadPost() {
    this.postInput$
      .pipe(
        concatMap((post: IPostList) => {
          if (post.id) {
            return this._service.getPostById(post.id);
          }
          return of({ error: 'Post has no ID' } as IServerResponse);
        }),
        tap((result) => {
          if (result.data) {
            const post = result.data as IPost;
            this.form.get('id')?.setValue(post.id);
            this.form.get('title')?.setValue(post.title);
            this.form.get('content')?.setValue(post.content);
            this.form.get('status')?.setValue(post.status);
            this.form.get('author')?.setValue(this.authors.find((author) => post.author?.username === author.username));
            // this.form.get('author')?.setValue(post.author?.username);
          }
        })
      )
      .subscribe();
  }

  public onSubmit(): void {
    const post = this.form.value;
    if (post.id) {
      this._service.patchPost(post).subscribe((result) => {
        this.savedPost.emit(result.data?.id);
        this.close();
      });
    } else {
      this._service.createPost(post).subscribe((result) => {
        this.savedPost.emit(result.data?.id);
        this.close();
      });
    }
  }

  public close(): void {
    this.form.reset();
    this.isVisible = false;
  }

  public toFormControl(control: string | AbstractControl): FormControl {
    if (control instanceof AbstractControl) {
      return control as FormControl;
    } else {
      return this.form.get(control) as FormControl;
    }
  }

  private _initForm(): void {
    this.form = this._fb.group({
      id: null,
      title: null,
      content: null,
      status: PostStatuses.DRAFT,
      author: null,
    });
  }
}
