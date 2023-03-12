import {Injectable} from '@angular/core';
import {Model} from "../model/model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

const URL = environment.backend

@Injectable({providedIn: 'root'})
export abstract class RestService<P, M extends Model> {

  protected readonly route: string;
  protected constructor(protected readonly client: HttpClient, modelRoute: string) {
    this.client = client;
    this.route = `${URL}/${modelRoute}`;
  }

  public find(id: string): Observable<M> {
    return this.client.get<M>(this.route + "/" + id);
  }

  public list(): Observable<M[]> {
    return this.client.get<M[]>(this.route);
  }

  public create(partial: P): Observable<M> {
    return this.client.post<M>(this.route, partial);
  }
}
