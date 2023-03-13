import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../../core/service/topic/topic.service";
import {interval, map, mergeMap, retry} from "rxjs";
import {Topic} from "../../../core/model/model";
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
    this.spinner.show("top");

    interval(1000).pipe(
      mergeMap(ignored => {
        return this.topicService.list().pipe(
          retry({delay: 1000}),
          map(topics => topics.sort((a, b) => {
            if (a.favorites > b.favorites)
              return -1;
            if (a.favorites < b.favorites)
              return 1;
            return 0;
          }).slice(0, 5))
        )
      })
    ).subscribe(response => {
      this.spinner.hide("top");
      this.topics = response;
    });
  }
}
