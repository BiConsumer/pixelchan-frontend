import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../../../core/service/topic/topic.service";
import {catchError, delay, filter, map, mergeMap, Observable, of} from "rxjs";
import {Topic} from "../../../../core/model/model";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html'
})
export class TopComponent implements OnInit {

  public topics: Topic[] = [];

  constructor(private topicService: TopicService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();

    this.topicService.list().pipe(
      delay(5000),
      map(topics => topics.sort((a, b) => {
        if (a.rating > b.rating)
          return -1;
        if (a.rating < b.rating)
          return 1;
        return 0;
      }).slice(0, 5))
    ).subscribe(response => {
      this.spinner.hide();
      this.topics = response;
    });
  }
}
