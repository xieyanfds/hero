import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  hero: Hero = {
    id :  123,
    name: 'webstorm'
  };
  heroes: Hero[];

  constructor(private heroService: HeroService) { }
  ngOnInit() {
    this.getHeroes();
  }

  /**
   * 上一个版本把英雄的数组赋值给了该组件的 heroes 属性.
   * 这种赋值是同步的，这里包含的假设是服务器能立即返回英
   * 雄数组或者浏览器能在等待服务器响应时冻结界面。
     当 HeroService 真的向远端服务器发起请求时，这种方式
     就行不通了。
     新的版本等待 Observable 发出这个英雄数组，这可能立即
     发生，也可能会在几分钟之后。 然后，subscribe 函数把这
     个英雄数组传给这个回调函数，该函数把英雄数组赋值给组件的
     heroes 属性。
     使用这种异步方式，当 HeroService 从远端服务器获取英雄数据时，就可以工作了。
   */
  getHeroes(): void {
    this.heroService.getHeroes().subscribe(hs => this.heroes = hs);
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}
