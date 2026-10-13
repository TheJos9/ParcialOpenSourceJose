import {Service} from '@angular/core';
import {environment} from '../../../environments/environment';

@Service()

export class LogoDevApi {

  baseUrl = environment.logoProviderApiBaseUrl;
  apiKey = environment.logoProviderPublishableKey;

  constructor() {
  }

  getUrlToLogo(url: string): string {
    //console.log('getUrlToLogo', source);
    return `${this.baseUrl}${new URL(url).hostname}?token=${this.apiKey}`;
  }
}
