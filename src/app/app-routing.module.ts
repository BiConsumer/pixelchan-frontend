import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoryComponent} from "./components/category/category/category.component";
import {CategoriesComponent} from "./components/category/categories/categories.component";
import {TopicComponent} from "./components/topic/topic/topic.component";

const routes: Routes = [
  {
    path: '',
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
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
