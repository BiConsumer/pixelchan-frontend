import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {forkJoin, map, mergeMap, of, retry} from "rxjs";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

  public displays : TopicDisplay[] = []

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.spinner.show("category");

    this.route.paramMap.subscribe(params => {
      this.categoryService.find(params.get('id')!).pipe(
        retry({delay: 1000}),
        mergeMap(category => {
          return this.topicService.ofCategorySortedByDate(category.id).pipe(
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
        this.spinner.hide("category");
        this.displays = result;
      })
    });
  }
}
