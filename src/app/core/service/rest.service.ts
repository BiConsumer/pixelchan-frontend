import { Injectable } from '@angular/core';
import {Model} from "../model/model";
import {catchError, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

const URL = "http://localhost:5000"

@Injectable({providedIn: 'root'})
export abstract class RestService<P, M extends Model> {

  protected readonly route: string;
  protected constructor(private readonly client: HttpClient, modelRoute: string) {
    this.client = client;
    this.route = `${URL}/${modelRoute}`;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
  public find(id: string): Observable<M> {
    return this.client.get<M>(this.route + "/" + id).pipe(
      catchError(this.handleError<M>('find'))
    );
  }

  public list(): Observable<M[]> {
    return this.client.get<M[]>(this.route).pipe(
      catchError(this.handleError<M[]>('list', []))
    );
  }

  public create(partial: P): Observable<M> {
    return this.client.post<M>(this.route, partial).pipe(
      catchError(this.handleError<M>('create'))
    );
  }
}
