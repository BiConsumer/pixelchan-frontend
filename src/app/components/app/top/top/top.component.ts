import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../../../core/service/topic/topic.service";
import {catchError, filter, map, mergeMap, Observable, of} from "rxjs";
import {Topic} from "../../../../core/model/model";

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html'
})
export class TopComponent implements OnInit {

  public topics: Observable<Topic[]> = of([]);

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
    this.topics = this.topicService.list().pipe(
      map(topics => topics.sort((a, b) => {
        if (a.rating > b.rating)
          return -1;
        if (a.rating < b.rating)
          return 1;
        return 0;
      }).slice(0, 5))
    );
  }
}
