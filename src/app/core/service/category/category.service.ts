import {Injectable} from '@angular/core';
import {RestService} from "../rest.service";
import {Category} from "../../model/model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CategoryService extends RestService<Category, Category> {
  constructor(private httpClient: HttpClient) {
    super(httpClient, 'category')
  }
}
