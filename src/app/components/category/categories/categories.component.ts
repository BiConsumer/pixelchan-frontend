import {Component, OnInit} from '@angular/core';
import {forkJoin, map, mergeMap, of, retry} from "rxjs";
import {CategoryDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  public displays: CategoryDisplay[] | undefined

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
      mergeMap(categories =>  {
        return forkJoin(
          categories.map(category => {
            return this.topicService.ofCategorySortedByDate(category.id).pipe(
              mergeMap(topics => {
                if (!topics.length) {
                  return of([])
                }

                return forkJoin(
                  topics.map(topic => {
                    return this.postService.ofTopic(topic.id).pipe(
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
                      return 1
                    }

                    if (b.posts[0] === undefined) {
                      return -1
                    }

                    if (a.posts[0].createdAt > b.posts[0].createdAt)
                      return -1;
                    if (a.posts[0].createdAt < b.posts[0].createdAt)
                      return 1;
                    return 0;
                  })
              }),
              map(topicDisplays => {
                return ({
                  category: category,
                  topicDisplays: topicDisplays
                })
              })
            )
          })
        )
      }),
      map(result => {
        return result.sort((a, b) => {

          if (!a.topicDisplays.length) {
            return 1
          }

          if (!b.topicDisplays.length) {
            return -1
          }

          if (a.topicDisplays[0].posts[0].createdAt > b.topicDisplays[0].posts[0].createdAt) {
            return -1;
          }

          if (b.topicDisplays[0].posts[0].createdAt > a.topicDisplays[0].posts[0].createdAt) {
            return 1;
          }

          return 0
        })
      })
    ).subscribe(result => {
      this.spinner.hide("categories");
      this.displays = result;
    })
  }
}
