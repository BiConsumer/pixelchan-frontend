import {Pipe, PipeTransform} from '@angular/core';

const intervals: { [key: string]: number } = {
  'year': 31536000,
  'month': 2592000,
  'week': 604800,
  'day': 86400,
  'hour': 3600,
  'minute': 60,
  'second': 1
};

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {

  transform(input: Date): any {
    if (input) {
      const seconds = Math.floor((+new Date() - +new Date(input)) / 1000);
      if (seconds < 29)
        return 'Just now';

      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago';
          } else {
            return counter + ' ' + i + 's ago';
          }
      }
    }
    return input;
  }

}
