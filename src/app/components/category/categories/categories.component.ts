import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {defaultIfEmpty, delay, forkJoin, map, mergeMap, Observable, of, retry} from "rxjs";
import {CategoryDisplay, Topic, TopicDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  public displays: CategoryDisplay[] = []

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.spinner.show("categories")

    this.categoryService.list().pipe(
      // delay(1000),
      retry({delay: 1000}),
      mergeMap(categories => {
        return forkJoin(
          categories.map(category => {
            return this.topicService.ofCategory(category.id).pipe(
              mergeMap(topics => {
                if (!topics.length) {
                  return of([])
                }

                return forkJoin(
                  topics.map(topic => {
                    return this.postService.ofTopic(topic.id).pipe(
                      defaultIfEmpty([]),

                      map(posts => ({
                        topic: topic,
                        posts: posts
                      }))
                    )
                  })
                )
              }),
              map(topicDisplays => {
                console.log("RETURNING SOMETHING MAN")

                return ({
                  category: category,
                  topicDisplays: topicDisplays
                })
              })
            )
          })
        )
      })
    ).subscribe(result => {
      this.spinner.hide("categories");
      this.displays = result;
    })
  }
}
