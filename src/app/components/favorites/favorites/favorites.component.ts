import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../../core/model/model";
import {TopicService} from "../../../core/service/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CookieService} from "ngx-cookie-service";
import {forkJoin, map, mergeMap, of, retry} from "rxjs";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {

  public displays: TopicDisplay[] = []

  constructor(
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
  ) {
  }

  private updateList(): void {
    if (!this.cookieService.check("favorites")) {
      this.cookieService.set("favorites", JSON.stringify([]))
    }

    let favorites : string[] = JSON.parse(this.cookieService.get("favorites"))

    this.topicService.list().pipe(
      retry({delay: 1000}),
      map(topics => {
        return topics.filter(topic => favorites.includes(topic.id))
      }),
      mergeMap(topics => {
        if (!topics.length) {
          return of([]);
        }

        return forkJoin(
          topics.map(topic => {
            return this.postService.ofTopicSortedByDate(topic.id).pipe(
              map(posts => ({
                topic: topic,
                posts: posts
              }))
            )
          })
        )
      }),
      map(topicDisplays => {
        return topicDisplays.filter(display => display.posts[0] !== undefined)
          .sort((a, b) => {

            if (a.posts[0] === undefined) {
              return 1;
            }

            if (b.posts[0] === undefined) {
              return -1;
            }

            if (a.posts[0].createdAt > b.posts[0].createdAt)
              return -1;
            if (a.posts[0].createdAt < b.posts[0].createdAt)
              return 1;
            return 0;
          })
      })
    ).subscribe(result => {
      this.spinner.hide("favorites");
      this.displays = result;
    })
  }

  ngOnInit() {
    this.spinner.show("favorites")
    this.updateList();
  }

  public unfavorite(topicId: string): void {
    console.log(topicId);
    this.topicService.unfavorite(topicId);
    this.updateList();
  }
}
