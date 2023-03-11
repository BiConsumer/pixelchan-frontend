import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  public currentLang: string;
  public options: string[];

  constructor(private translateService: TranslateService, private cookieService: CookieService) {
    translateService.addLangs(["en", "fr"]);
    translateService.setDefaultLang("en");

    this.currentLang = cookieService.get("lang") || "en"
    translateService.use(this.currentLang)

    this.options = this.updateOptions();
  }

  changeLanguage(language: string): void {
    this.translateService.use(language);
    this.currentLang = language
    this.cookieService.set("lang", language)
    this.options = this.updateOptions();
  }

  private updateOptions(): string[] {
    return this.translateService.getLangs().filter(lang => lang !== this.currentLang);
  }

}
