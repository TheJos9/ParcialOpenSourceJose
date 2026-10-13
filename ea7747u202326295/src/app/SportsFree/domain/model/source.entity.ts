import {Url} from '../../../shared/domain/model/url';

export class Source {

  id: string;

  name: string;

  description: string;

  url: Url;

  urlToLogo: Url;

  category: string;

  language: string;

  country: string;

  get urlAsString(): string {
    return this.url.toString();
  }

  get urlToLogoAsString(): string {
    return this.urlToLogo.toString();
  }

  constructor() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.url = new Url('');
    this.urlToLogo = new Url('');
    this.category = '';
    this.language = '';
    this.country = '';
  }


}
