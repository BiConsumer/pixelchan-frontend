import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../../core/model/model";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {mergeMap, retry} from "rxjs";
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent extends AppComponent implements OnInit {

  public displays : TopicDisplay[] | undefined

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.spinner.show("category");

    this.route.paramMap.subscribe(params => {
      this.categoryService.find(params.get('id')!).pipe(
        retry({delay: 1000}),
        mergeMap(category => {
          return this.topicService.displaysOfCategory(category.id)
        })
      ).subscribe(result => {
        this.spinner.hide("category");
        this.displays = result;
      })
    });
  }
}
