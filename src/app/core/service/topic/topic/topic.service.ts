import {Injectable} from '@angular/core';
import {RestService} from "../../rest.service";
import {Topic, TopicCreateRequest} from "../../../model/model";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs"

@Injectable({providedIn: 'root'})
export class TopicService extends RestService<TopicCreateRequest, Topic> {
  constructor(httpClient: HttpClient) {
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

}
