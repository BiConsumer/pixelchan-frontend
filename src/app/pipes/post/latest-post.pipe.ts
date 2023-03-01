import { Pipe, PipeTransform } from '@angular/core';
import {Post, Topic, TopicDisplay} from "../../core/model/model";

@Pipe({
  name: 'latestPost'
})
export class LatestPostPipe implements PipeTransform {

  transform(input: Post[]): Post[] {
    return input.sort((a, b) => {
        if (a.createdAt > b.createdAt)
          return -1;
        if (a.createdAt < b.createdAt)
          return 1;
        return 0;
      }).slice(0, 1)
  }
}

export interface TopicLatestDisplay {
  topic: Topic,
  latestPost: Post
}
