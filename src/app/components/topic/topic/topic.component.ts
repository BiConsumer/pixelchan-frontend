import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {forkJoin, map, mergeMap} from "rxjs";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html'
})
export class TopicComponent implements OnInit{

  public topicDisplay: TopicDisplay | undefined

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    console.log("loading")
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
}
