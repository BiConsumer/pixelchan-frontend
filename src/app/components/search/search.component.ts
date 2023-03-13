import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Category, Topic, TopicDisplay} from "../../core/model/model";
import {AppComponent} from "../../app.component";
import {CategoryService} from "../../core/service/category/category.service";
import {TopicService} from "../../core/service/topic/topic.service";
import {PostService} from "../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {map, retry} from "rxjs";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent extends AppComponent implements OnInit {

  public searchForm : FormGroup;
  public displays: TopicDisplay[] = []
  public categories: Category[] = []

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private topicService: TopicService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
  ) {
    super();

    this.searchForm = this.formBuilder.group({
      keywords: new FormControl('', {nonNullable: true}),
      minFavorites: null,
      maxFavorites: null,
      popular: new FormControl('none', {nonNullable: true})
    });
  }

  ngOnInit() {
    this.categoryService.list().subscribe(result => {
      for (let category of result) {
        this.searchForm.addControl(category.id, new FormControl(true, {nonNullable: true}));
      }

      this.categories = result;
    })

    this.search();
  }

  public search(): void {
    console.log(this.searchForm.value);
    this.spinner.show("search");

    this.topicService.displays().pipe(
      retry({delay: 1000}),
      map(topicDisplays => {
        return topicDisplays.filter(topicDisplay => {
          let topic: Topic = topicDisplay.topic;

          return topic.name.toLowerCase().includes(this.searchForm.value.keywords)
            && (this.searchForm.value.minFavorites == null || topic.favorites >= this.searchForm.value.minFavorites)
            && (this.searchForm.value.maxFavorites == null || topic.favorites <= this.searchForm.value.maxFavorites)
            && (
              this.searchForm.value.popular == "none"
              || (this.searchForm.value.popular == "yes" && topic.favorites >= this.POPULAR_COUNT)
              || (this.searchForm.value.popular == "no" && topic.favorites < this.POPULAR_COUNT)
            )
            && this.searchForm.value[topic.category]
        })
      })
    ).subscribe(result => {
      this.spinner.hide("search");
      this.displays = result;
    })
  }
}
