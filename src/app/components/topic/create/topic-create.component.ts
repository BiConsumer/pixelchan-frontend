import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {CategoryService} from "../../../core/service/category/category.service";
import {TopicService} from "../../../core/service/topic/topic.service";
import {PostService} from "../../../core/service/post/post.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Category, TopicCreateRequest} from "../../../core/model/model";

@Component({
  selector: 'app-create',
  templateUrl: './topic-create.component.html'
})
export class TopicCreateComponent implements OnInit {

  public createForm : FormGroup = this.formBuilder.group({
    category: null,
    name: new FormControl('', {nonNullable: true}),
    content: new FormControl('', {nonNullable: true}),
  });

  public categories: Category[] | undefined

  constructor(
    private categoryService: CategoryService,
    private topicService: TopicService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  public remainingChars(): number {
    return 1000 - this.createForm.value.content.length;
  }

  public chars(): number {
    return this.createForm.value.content.length
  }

  ngOnInit() {
    this.spinner.show("topic-create");

    this.categoryService.list().subscribe(result => {
      this.spinner.hide("topic-create");
      this.categories = result;

      this.createForm.controls["category"].setValue(result[0].id);
    })
  }

  create(): void {

    let request: TopicCreateRequest = {
      category: this.createForm.value.category,
      name: this.createForm.value.name,
      postContent: this.createForm.value.content
    }

    this.topicService.create(request).subscribe(topic => {
      this.router.navigate(["/topic/" + topic.id]);
    })
  }
}
