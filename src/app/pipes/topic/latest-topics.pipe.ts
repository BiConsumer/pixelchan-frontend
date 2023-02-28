import { Pipe, PipeTransform } from '@angular/core';
import {Post, Topic, TopicDisplay} from "../../core/model/model";

@Pipe({
  name: 'latestTopics'
})
export class LatestPipe implements PipeTransform {

  transform(input: TopicDisplay[]): TopicLatestDisplay[] {
    return input.filter(display => display.posts[0] !== undefined)
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
    }).map(display => ({
      topic: display.topic,
      latestPost: display.posts[0]
    })).slice(0, 6)
  }
}

export interface TopicLatestDisplay {
  topic: Topic,
  latestPost: Post
}
