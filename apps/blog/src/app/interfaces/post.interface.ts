export interface IAuthor {
  username?: string;
}

export interface IPost {
  id?: string;
  title?: string;
  status?: string;
  content?: string;
  author?: IAuthor;
}
