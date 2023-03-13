import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../core/model/model";
import {TopicService} from "../../core/service/topic/topic.service";
import {PostService} from "../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CookieService} from "ngx-cookie-service";
import {forkJoin, map, mergeMap, of, retry} from "rxjs";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends AppComponent implements OnInit {

  public displays: TopicDisplay[] = []

  constructor(
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
  ) {
    super();
  }

  private updateList(): void {
    if (!this.cookieService.check("favorites")) {
      this.cookieService.set("favorites", JSON.stringify([]))
    }

    let favorites : string[] = JSON.parse(this.cookieService.get("favorites"))

    this.topicService.displays().pipe(
      retry({delay: 1000}),
      map(topicDisplays => {
        return topicDisplays.filter(topicDisplay => favorites.includes(topicDisplay.topic.id))
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
