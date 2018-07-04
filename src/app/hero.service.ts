import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap, map} from 'rxjs/internal/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/*这个新的服务导入了Angular的Injectable符号并且给这个服务类添加了 @Injectable() 装饰器。
它把这个类标记为依赖注入系统的参与者之一。
HeroService 类将会提供一个可注入的服务，并且它还可以拥有自己的待注入的依赖 MessageService。
@Injectable() 装饰器会接受该服务的元数据对象，就像 @Component() 对组件类的作用一样
*/
@Injectable({
  providedIn: 'root'
})
export class HeroService {


  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  private heroesUrl = '/apis/heroes';

  /** GET heroes from the server */
  /** catchError()会拦截失败的Observable，它可以把错误传给错误处理器，错误处理器会处理这个错误
  *  handleError（）会报告这个错误，并返回一个无害的结果（安全值），以便应用可以正常工作
  *  tap可以实现将observable中的值传出来，这种回调不会改变值本身*/
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl, httpOptions)
      .pipe(
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  /** catchError()会拦截失败的Observable，它可以把错误传给错误处理器，错误处理器会处理这个错误
  *  handleError（）会报告这个错误，并返回一个无害的结果（安全值），以便应用可以正常工作
  *  tap可以实现将observable中的值传出来，这种回调不会改变值本身*/
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  /* catchError()会拦截失败的Observable，它可以把错误传给错误处理器，错误处理器会处理这个错误
  *  handleError（）会报告这个错误，并返回一个无害的结果（安全值），以便应用可以正常工作
  *  tap可以实现将observable中的值传出来，这种回调不会改变值本身*/
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    const url = `${this.heroesUrl}/?name=${term}`;

    return this.http.get<Hero[]>(url).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  /**
   *   HeroService.addHero() 和 updateHero 有两点不同。
       它调用 HttpClient.post() 而不是 put()。
       它期待服务器为这个新的英雄生成一个 id，然后把它通过 Observable<Hero> 返回给调用者。
   * @param {Hero} hero
   * @returns {Observable<Hero>}
   */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  /**
   *
     1 它调用了 HttpClient.delete。
     2 URL 就是英雄的资源 URL 加上要删除的英雄的 id。
     3 你不用像 put 和 post 中那样发送任何数据。
     4 你仍要发送 httpOptions。
   * @param {Hero | number} hero
   * @returns {Observable<Hero>}
   */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
  /**
   * put请求将修改后的数据保存
   *
     URL 地址
     要修改的数据（这里就是修改后的英雄）
     选项
   */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
