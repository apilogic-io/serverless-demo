export interface IComment {
  id?: string;
  body?: string;
  author?: IAuthor;
}

export interface IAuthor {
  username?: string;
}

export interface IPost {
  id?: string;
  title?: string;
  status?: string;
  content?: string;
  author?: IAuthor;
  comments?: IComment[];
}
