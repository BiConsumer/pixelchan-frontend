import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {forkJoin, map, mergeMap} from "rxjs";
import {AnimationOptions, BMEnterFrameEvent} from "ngx-lottie";
import {AnimationItem} from "lottie-web";

const LIKE_FRAME_START = 1;
const LIKE_FRAME_END = 55;

const UNLIKE_FRAME_START = 80;
const UNLIKE_FRAME_END = 115;

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html'
})
export class TopicComponent implements OnInit{

  public topicDisplay: TopicDisplay | undefined
  public canHover: boolean = true;

  private animationItem: AnimationItem | undefined;
  private isFavorite: boolean = false;

  options: AnimationOptions = {
    path: '/assets/lotties/favorite.json',
    loop: false,
    autoplay: false
  };

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.spinner.show("topic");

    this.route.paramMap.subscribe(params => {
      this.topicService.find(params.get('id')!).pipe(
        mergeMap(topic => {
          return this.postService.ofTopicSortedByDate(topic.id).pipe(
            map(posts => ({
              topic: topic,
              posts: posts
            }))
          )
        })
      ).subscribe(result => {
        this.spinner.hide("topic");
        this.topicDisplay = result;
      })
    });
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  favorite(): void {
    if (this.animationItem === undefined) {
      return;
    }

    this.canHover = false
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      this.animationItem.playSegments([LIKE_FRAME_START, LIKE_FRAME_END], true);
    } else {
      this.animationItem.playSegments([UNLIKE_FRAME_START, UNLIKE_FRAME_END], true);
    }
  }

  complete() {
    this.canHover = true;
  }
}
