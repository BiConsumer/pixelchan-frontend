import {Component, OnInit} from '@angular/core';
import {PostCreateRequest, TopicDisplay} from "../../core/model/model";
import {CategoryService} from "../../core/service/category/category.service";
import {TopicService} from "../../core/service/topic/topic.service";
import {PostService} from "../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {delay, map, mergeMap, retry} from "rxjs";
import {AnimationOptions} from "ngx-lottie";
import {AnimationItem} from "lottie-web";
import {CookieService} from "ngx-cookie-service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

const LIKE_FRAME_START = 1;
const LIKE_FRAME_END = 55;

const UNLIKE_FRAME_START = 80;
const UNLIKE_FRAME_END = 115;

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html'
})
export class TopicComponent implements OnInit{

  public postForm : FormGroup = this.formBuilder.group({
    content: new FormControl('', {nonNullable: true}),
  });

  public topicDisplay: TopicDisplay | undefined
  public canHover: boolean = true;
  public favoriteCount: number = 0;

  private animationItem: AnimationItem | undefined;
  private isFavorite: boolean = false;

  public options: AnimationOptions = {
    path: '/assets/lotties/favorite.json',
    loop: false,
    autoplay: false
  };

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
  }

  post(): void {
    let topicId: string = this.route.snapshot.paramMap.get("id")!;

    let request: PostCreateRequest = {
      topic: topicId,
      content: this.postForm.value.content
    }


    this.postForm.reset();
    this.postService.create(request).subscribe(ignored => {
      this.update(topicId);
    })
  }

  chars(): number {
    return this.postForm.value.content.length;
  }

  remainingChars() : number {
    return 1000 - this.postForm.value.content.length
  }

  private update(topicId: string): void {
    this.topicService.find(topicId).pipe(
      retry({delay: 1000}),
      mergeMap(topic => {
        return this.postService.ofTopicSortedByDateFromOldest(topic.id).pipe(
          map(posts => ({
            topic: topic,
            posts: posts
          }))
        )
      })
    ).subscribe(result => {
      this.spinner.hide("topic");
      this.favoriteCount = result.topic.favorites;

      if (!this.cookieService.check("favorites")) {
        this.cookieService.set("favorites", JSON.stringify([]))
      }

      let favorites : string[] = JSON.parse(this.cookieService.get("favorites"))
      this.animationItem?.resetSegments(true);

      if (favorites.includes(result.topic.id)) {
        this.isFavorite = true;
        this.animationItem?.goToAndStop(LIKE_FRAME_END, true);
      } else {
        this.isFavorite = false;
        this.animationItem?.goToAndStop(UNLIKE_FRAME_END, true);
      }

      this.topicDisplay = result;
    })
  }

  ngOnInit() {
    this.spinner.show("topic");

    this.route.paramMap.subscribe(params => {
      this.update(params.get("id")!)
    });
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  favorite(): void {
    if (this.animationItem === undefined) {
      return;
    }

    if (this.topicDisplay === undefined) {
      return;
    }

    this.canHover = false;
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      this.animationItem.playSegments([LIKE_FRAME_START, LIKE_FRAME_END], true);
      this.favoriteCount++;
      this.topicService.favorite(this.topicDisplay.topic.id);
    } else {
      this.animationItem.playSegments([UNLIKE_FRAME_START, UNLIKE_FRAME_END], true);
      this.favoriteCount--;
      this.topicService.unfavorite(this.topicDisplay.topic.id);
    }
  }

  complete() {
    this.canHover = true;
  }
}
