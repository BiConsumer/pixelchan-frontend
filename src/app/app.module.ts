import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/app/header/header.component';
import { FooterComponent } from './components/app/footer/footer/footer.component';
import { NavComponent } from './components/app/nav/nav/nav.component';
import { TopComponent } from './components/app/top/top/top.component';
import {HttpClientModule} from "@angular/common/http";
import { CategoryComponent } from './components/category/category/category.component';
import { DateAgoPipe } from './pipes/date/date-ago.pipe';
import {CategoriesComponent} from "./components/category/categories/categories.component";
import {NgxSpinnerModule} from "ngx-spinner";
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LatestPostPipe } from './pipes/post/latest-post.pipe';

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
    LatestPostPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
