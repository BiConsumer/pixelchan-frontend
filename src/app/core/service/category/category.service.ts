import {Injectable} from '@angular/core';
import {RestService} from "../rest.service";
import {Category, CategoryDisplay, Post, TopicDisplay} from "../../model/model";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class CategoryService extends RestService<Category, Category> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'category')
  }

  private orderedPosts(posts: Post[]) : Post[] {
    return posts.sort((a, b) => {

      if (a.createdAt > b.createdAt) {
        return -1;
      }

      if (b.createdAt > a.createdAt) {
        return 1;
      }

      return 0;
    })
  }

  private orderedTopicDisplays(topicDisplays: TopicDisplay[]) : TopicDisplay[] {
    return topicDisplays.sort((a, b) => {

        let latestPostA : Post = this.orderedPosts(a.posts)[0];
        let latestPostB : Post = this.orderedPosts(b.posts)[0];

        if (latestPostA.createdAt > latestPostB.createdAt) {
          return -1;
        }

        if (latestPostB.createdAt > latestPostA.createdAt) {
          return 1;
        }

        return 0;
      })
  }

  displays() : Observable<CategoryDisplay[]> {
    return this.client.get<CategoryDisplay[]>(this.route + "/displays/").pipe(
      map(categoryDisplays => {
        return categoryDisplays.sort((a, b) => {

          if (a.topicDisplays.length <= 0) {
            return 1;
          }

          if (b.topicDisplays.length <= 0) {
            return -1
          }

          let latestPostA : Post = this.orderedTopicDisplays(a.topicDisplays)[0].posts[0];
          let latestPostB : Post = this.orderedTopicDisplays(b.topicDisplays)[0].posts[0];


          if (latestPostA.createdAt > latestPostB.createdAt) {
            return -1;
          }

          if (latestPostB.createdAt > latestPostA.createdAt) {
            return 1;
          }

          return 0;
        })
      })
    )
  }
}
