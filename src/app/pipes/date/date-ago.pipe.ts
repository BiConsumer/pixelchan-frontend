import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {mergeMap} from "rxjs";

const intervals: { [key: string]: number } = {
  'YEAR': 31536000,
  'MONTH': 2592000,
  'WEEK': 604800,
  'DAY': 86400,
  'HOUR': 3600,
  'MINUTE': 60,
  'SECOND': 1
};

@Pipe({
  name: 'dateAgo',
  pure: false
})
export class DateAgoPipe implements PipeTransform {

  value: string = "";

  constructor(private translateService: TranslateService) {
  }

  transform(input: Date): any {
    if (input) {
      const seconds = Math.floor((+new Date() - +new Date(input)) / 1000);
      if (seconds < 29) {
        this.translateService.getStreamOnTranslationChange("TIME.JUST-NOW").subscribe(result => {
          this.value = result;
        })

        return this.value
      }

      let counter: number;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {

          let tense = counter === 1 ? "SINGULAR" : "PLURAL";

          this.translateService.getStreamOnTranslationChange("TIME." + i + "." + tense).pipe(
            mergeMap(unit => {
              return this.translateService.get("TIME.AGO", {
                value: counter,
                unit: unit
              })
            })
          ).subscribe(result => {
            this.value = result;
          })

          break;
        }
      }
    }

    return this.value;
  }
}
