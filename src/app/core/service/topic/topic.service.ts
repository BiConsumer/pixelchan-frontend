import {Injectable} from '@angular/core';
import {RestService} from "../rest.service";
import {Post, Topic, TopicCreateRequest, TopicDisplay} from "../../model/model";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs"
import {CookieService} from "ngx-cookie-service";

@Injectable({providedIn: 'root'})
export class TopicService extends RestService<TopicCreateRequest, Topic> {

  constructor(httpClient: HttpClient, private cookieService: CookieService) {
    super(httpClient, 'topic')
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

  displays() : Observable<TopicDisplay[]> {
    return this.client.get<TopicDisplay[]>(this.route + "/displays/").pipe(
      map(topicDisplays => {
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
      })
    )
  }

  displaysOfCategory(categoryId: string) : Observable<TopicDisplay[]> {
    return this.client.get<TopicDisplay[]>(this.route + "/displays/").pipe(
      map(topicDisplays => {
        return topicDisplays.filter(topicDisplay => {
          return topicDisplay.topic.category === categoryId
        }).sort((a, b) => {

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
      })
    )
  }

  public favorite(topicId: string): void {
    let favorites : string[] = JSON.parse(this.cookieService.get("favorites"))
    favorites.push(topicId)
    this.cookieService.set("favorites", JSON.stringify(favorites));

    this.client.get(this.route + "/favorite/" + topicId).subscribe();
  }

  public unfavorite(topicId: string): void {
    let favorites : string[] = JSON.parse(this.cookieService.get("favorites"))

    this.cookieService.set("favorites", JSON.stringify(favorites.filter(value => {
      return value !== topicId;
    })))

    this.client.get(this.route + "/unfavorite/" + topicId).subscribe();
  }

}
