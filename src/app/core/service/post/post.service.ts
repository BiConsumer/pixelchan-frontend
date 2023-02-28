import { Injectable } from '@angular/core';
import {RestService} from "../rest.service";
import {Post, PostCreateRequest} from "../../model/model";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class PostService extends RestService<PostCreateRequest, Post> {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'post')
  }

  public ofTopic(topicId: string): Observable<Post[]> {
    return this.list().pipe(
      map(posts => posts.filter(post => post.topic === topicId))
    );
  }

  public ofTopicSortedByDate(topicId: string): Observable<Post[]> {
    return this.ofTopic(topicId).pipe(
      map(posts => posts.sort((a, b) => {
        if (a.createdAt > b.createdAt)
          return -1;
        if (a.createdAt < b.createdAt)
          return 1;
        return 0;
      }))
    );
  }

}
