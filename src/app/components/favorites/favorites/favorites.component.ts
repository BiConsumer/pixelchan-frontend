import {Component, OnInit} from '@angular/core';
import {TopicDisplay} from "../../../core/model/model";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {

  public topicDisplays: TopicDisplay[] = []

  ngOnInit() {

  }
}
