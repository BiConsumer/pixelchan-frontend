import {Injectable} from '@angular/core';
import {RestService} from "../rest.service";
import {Topic, TopicCreateRequest} from "../../model/model";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs"
import {CookieService} from "ngx-cookie-service";

@Injectable({providedIn: 'root'})
export class TopicService extends RestService<TopicCreateRequest, Topic> {

  constructor(httpClient: HttpClient, private cookieService: CookieService) {
    super(httpClient, 'topic')
  }

  public ofCategory(categoryId: string): Observable<Topic[]> {
    return this.list().pipe(
      map(topics => topics.filter(topic => topic.category === categoryId))
    );
  }

  public ofCategorySortedByDate(topicId: string): Observable<Topic[]> {
    return this.ofCategory(topicId).pipe(
      map(topics => topics.sort((a, b) => {
        if (a.createdAt > b.createdAt)
          return -1;
        if (a.createdAt < b.createdAt)
          return 1;
        return 0;
      }))
    );
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
