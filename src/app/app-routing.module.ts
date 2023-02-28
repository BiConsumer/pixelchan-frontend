import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoryComponent} from "./components/category/category/category.component";
import {AppComponent} from "./app.component";
import {CategoriesComponent} from "./components/category/categories/categories.component";

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
