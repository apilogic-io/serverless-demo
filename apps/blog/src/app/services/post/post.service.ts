import { Injectable } from '@angular/core';
import { ApolloError, FetchPolicy } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPostList } from '../../interfaces/post-list.interface';
import { IPost } from '../../interfaces/post.interface';
import { IServerResponse } from '../../interfaces/server-response.interface';
import { CREATE_POST, FIND_POSTS, GET_POST_BY_ID, PATCH_POST } from './post-gql';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _apollo: Apollo) {}

  public createPost(post: IPost): Observable<IServerResponse> {
    return this._apollo
      .mutate<{ createPostPipeline: IServerResponse }>({
        mutation: CREATE_POST,
        variables: { post: post },
      })
      .pipe(
        map((mutaionResponse) => {
          const response = { data: mutaionResponse?.data?.createPostPipeline, loading: false };
          return response;
        }),
        catchError((error: any): Observable<IServerResponse> => of({ data: null, error: error, loading: false }))
      );
  }

  public patchPost(post: IPost): Observable<IServerResponse> {
    return this._apollo
      .mutate<{ patchPostPipeline: IServerResponse }>({
        mutation: PATCH_POST,
        variables: { post: post },
      })
      .pipe(
        map((mutaionResponse) => {
          const response = { data: mutaionResponse?.data?.patchPostPipeline, loading: false };
          return response;
        }),
        catchError((error: any): Observable<IServerResponse> => of({ data: null, error: error, loading: false }))
      );
  }

  public getPostById(id: string, fetchPolicy?: FetchPolicy): Observable<IServerResponse> {
    const options = {
      query: GET_POST_BY_ID,
      variables: { id },
      fetchPolicy: 'no-cache' as FetchPolicy,
    };
    if (fetchPolicy) {
      Object.assign(options, { fetchPolicy });
    }
    return this._apollo.query<{ getPostById: IPost | null }>(options).pipe(
      map((response) => {
        const readonlyAccount = response.data.getPostById;
        if (readonlyAccount) {
          return { data: response.data.getPostById, loading: false };
        } else {
          return { data: null, loading: false };
        }
      }),
      catchError((error: ApolloError): Observable<IServerResponse> => {
        return of({ data: null, error: error, loading: false });
      })
    );
  }

  public findPosts(author?: string, fetchPolicy?: FetchPolicy): Observable<IServerResponse> {
    const options = {
      query: FIND_POSTS,
      variables: { author },
      fetchPolicy: 'no-cache' as FetchPolicy,
    };
    if (fetchPolicy) {
      Object.assign(options, { fetchPolicy });
    }
    return this._apollo.query<{ findPosts: IPostList[] | null }>(options).pipe(
      map((response) => {
        const readonlyAccount = response.data.findPosts;
        if (readonlyAccount) {
          return { data: response.data.findPosts, loading: false };
        } else {
          return { data: null, loading: false };
        }
      }),
      catchError((error: ApolloError): Observable<IServerResponse> => {
        return of({ data: null, error: error, loading: false });
      })
    );
  }
}
