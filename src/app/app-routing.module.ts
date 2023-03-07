import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoryComponent} from "./components/category/category/category.component";
import {CategoriesComponent} from "./components/category/categories/categories.component";
import {TopicComponent} from "./components/topic/topic.component";
import {FavoritesComponent} from "./components/favorites/favorites/favorites.component";
import {SearchComponent} from "./components/search/search.component";

const routes: Routes = [
  {
    path: 'home',
    component: CategoriesComponent
  },
  {
    path: 'category/:id',
    component: CategoryComponent
  },
  {
    path: 'topic/:id',
    component: TopicComponent
  },
  {
    path: 'topic/:id/:post',
    component: TopicComponent
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
