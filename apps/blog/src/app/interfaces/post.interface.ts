export interface IPost {
  id?: string;
  title?: string;
  status?: string;
  content?: string;
  author?:
    | {
        username?: string;
      }
    | string;
}
