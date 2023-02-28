import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {forkJoin, map, mergeMap, Observable, of} from "rxjs";
import {CategoryDisplay, Topic, TopicDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

  public displays: CategoryDisplay[] = []

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService
  ) {
  }

  ngOnInit() {
    this.categoryService.list().pipe(
      mergeMap(categories =>
        forkJoin(
          categories.map(category =>
            this.topicService.ofCategory(category.id).pipe(
              mergeMap(topics =>
                forkJoin(topics.map(topic =>
                  this.postService.ofTopicSortedByDate(topic.id).pipe(
                    map(posts => ({
                      topic: topic,
                      posts: posts
                    }))
                  )
                ))
              )
            ).pipe(
              map(topicDisplays => ({
                category: category,
                topicDisplays: topicDisplays
              }))
            )
          )
        )
      )
    ).subscribe(result => this.displays = result)
  }
}
