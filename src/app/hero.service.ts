import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';


/*这个新的服务导入了Angular的Injectable符号并且给这个服务类添加了 @Injectable() 装饰器。
它把这个类标记为依赖注入系统的参与者之一。
HeroService 类将会提供一个可注入的服务，并且它还可以拥有自己的待注入的依赖 MessageService。
@Injectable() 装饰器会接受该服务的元数据对象，就像 @Component() 对组件类的作用一样
*/
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) {
  }

  private heroesUrl = 'api/heroes'
  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }


  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

  private log(message: string){
    this.messageService.add(`HeroService: ` + message);
  }
}
