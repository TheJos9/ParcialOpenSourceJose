import {Source} from './source.entity';
import {DateTime} from '../../../shared/domain/model/date-time';
import {Url} from '../../../shared/domain/model/url';

export class Article {
  author: string;

  title: string;

  description: string;

  url: Url;

  urlToImage: Url;

  publishedAt: DateTime;

  source: Source;

  get urlAsString(): string {
    return this.url.toString();
  }

  get urlToImageAsString(): string {
    return this.urlToImage.toString();
  }

  constructor() {
    this.author = '';
    this.title = '';
    this.description = '';
    this.url = new Url('');
    this.urlToImage = new Url('');
    this.publishedAt = new DateTime();
    this.source = new Source();
  }

  public updateSourceInformation = (source: Source): void => {
    this.source.urlToLogo = source.urlToLogo;
    this.source.url = source.url;
    this.source.description = source.description;
    this.source.category = source.category;
    this.source.language = source.language;
    this.source.country = source.country;
  };

}
