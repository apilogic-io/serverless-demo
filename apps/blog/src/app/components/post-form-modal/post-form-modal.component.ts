import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { authors } from '../../consts/authors.const';
import { PostStatuses } from '../../enums/post-statuses.enum';
import { IPostList } from '../../interfaces/post-list.interface';
import { IAuthor } from '../../interfaces/post.interface';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'post-form-modal',
  templateUrl: './post-form-modal.component.html',
  styleUrls: ['./post-form-modal.component.less'],
})
export class PostFormModalComponent implements OnInit {
  @Input() showModal$: Subject<boolean> = new Subject();
  @Input() postInput?: IPostList;

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
    this.postInput = undefined;
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
      author: this._fb.group({
        username: null,
      }),
    });
  }
}
