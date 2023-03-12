import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/app/header/header.component';
import {FooterComponent} from './components/app/footer/footer.component';
import {NavComponent} from './components/app/nav/nav.component';
import {TopComponent} from './components/app/top/top.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CategoryComponent} from './components/category/category/category.component';
import {DateAgoPipe} from './pipes/date/date-ago.pipe';
import {CategoriesComponent} from "./components/category/categories/categories.component";
import {NgxSpinnerModule} from "ngx-spinner";
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TopicComponent} from './components/topic/topic.component';
import {LottieModule} from "ngx-lottie";
import {CookieService} from "ngx-cookie-service";
import {FavoritesComponent} from './components/favorites/favorites.component';
import {SearchComponent} from './components/search/search.component';
import {ReactiveFormsModule} from "@angular/forms";
import { TopicCreateComponent } from './components/topic/create/topic-create.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function playerFactory() {
  return import('lottie-web');
}
export function httpTranslateLoader(client: HttpClient) {
  return new TranslateHttpLoader(client);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    TopComponent,
    CategoryComponent,
    CategoriesComponent,
    DateAgoPipe,
    TopicComponent,
    FavoritesComponent,
    SearchComponent,
    TopicCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LottieModule.forRoot({player: playerFactory}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {



}
