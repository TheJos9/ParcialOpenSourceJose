import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {NewsStore} from '../../../../SportsFree/application/sportsfree.store';
import {Source} from '../../../../SportsFree/domain/model/source.entity';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {SourceList} from '../../../../SportsFree/presentation/components/source-list/source-list';
import {MatIcon} from '@angular/material/icon';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {ArticleList} from '../../../../SportsFree/presentation/components/article-list/article-list';
import {Footer} from '../footer/footer';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavContainer,
    MatToolbar,
    MatSidenav,
    SourceList,
    MatSidenavContent,
    MatIcon,
    LanguageSwitcher,
    ArticleList,
    Footer,
    MatIconButton
  ],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './layout.css'
})

export class Layout implements OnInit {


  protected store = inject(NewsStore);

  protected readonly sources = this.store.sources;
  protected readonly articles = this.store.currentSourceArticles;


  ngOnInit(): void {
    this.store.loadSources();
    this.store.loadArticlesForCurrentSource();
  }

  updateArticlesBySource(source: Source): void {
    this.store.currentSource = source;
    this.store.loadArticlesForCurrentSource();
  }
}
