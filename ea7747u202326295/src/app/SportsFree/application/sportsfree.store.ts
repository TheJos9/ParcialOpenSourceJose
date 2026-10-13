import {computed, inject, Service, signal} from '@angular/core';
import {Source} from '../domain/model/source.entity';
import {Article} from '../domain/model/article.entity';
import {SportsfreeApi} from '../infrastructure/sportsfree-api';
import {LogoDevApi} from '../../outdoor-centers/infrastructure/logo-dev-api';
import {Url} from '../../outdoor-centers/domain/model/url';

@Service()

export class NewsStore {

  private sourcesSignal = signal<Source[]>([]);

  private articlesSignal = signal<Record<string, Article[]>>({});
  private newsApi = inject(SportsfreeApi);
  private logoApi = inject(LogoDevApi);

  readonly sources = computed(() => this.sourcesSignal());

  readonly articles = computed(() => this.articlesSignal());

  public currentSourceArticles = computed(() => this.articlesSignal()[this.currentSource?.id] ?? []);

  private _currentSource!: Source;

  loadSources() {
    if (this.sourcesSignal().length === 0) {
      this.newsApi.getSources().subscribe(sources => {
        sources.forEach(source => source.urlToLogo = new Url(this.logoApi.getUrlToLogo(source.urlAsString)));
        this.sourcesSignal.set(sources);
        this.currentSource = sources[0];
        this.loadArticlesForCurrentSource();
      });
    }
  }

  loadArticlesForCurrentSource() {
    console.log(this.currentSource);
    const current = this.articlesSignal() ?? {};
    const source = this._currentSource;
    if (!current[source.id]) {
      this.newsApi.getArticlesBySourceId(source.id).subscribe(articles => {
        articles.forEach(article => {
          article.updateSourceInformation(source);
        });
        this.articlesSignal.set({ ...current, [source.id]: articles });
      });
    }
  }

  get currentSource(): Source {
    return this._currentSource;
  }

  set currentSource(value: Source) {
    this._currentSource = value;
    this.loadArticlesForCurrentSource();
  }

}
