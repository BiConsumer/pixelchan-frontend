import {Component, OnInit} from '@angular/core';
import {retry} from "rxjs";
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

    this.categoryService.displays().pipe(
      // delay(1000),
      retry({delay: 1000}),
    ).subscribe(result => {
      this.spinner.hide("categories");
      this.displays = result;
    })
  }
}
