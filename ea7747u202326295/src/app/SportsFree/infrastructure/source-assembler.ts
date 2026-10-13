import {SourceResource, SourcesResponse} from './sources-response';
import {LogoDevApi} from '../../outdoor-centers/infrastructure/logo-dev-api';
import {Source} from '../domain/model/source.entity';
import {Url} from '../../outdoor-centers/domain/model/url';
import {inject, Service} from '@angular/core';

@Service()
export class SourceAssembler {

  private logoApi = inject(LogoDevApi);

  toEntityFromResource(resource: SourceResource): Source {
    let source = new Source();
    source.id = resource.id;
    source.name = resource.name;
    source.description = resource.description || '';
    source.url = new Url(resource.url || '');
    source.category = resource.category || '';
    source.language = resource.language || '';
    source.country = resource.country || '';
    source.urlToLogo = new Url(this.logoApi.getUrlToLogo(resource.url));
    return source;
  }

  toEntitiesFromResponse(response: SourcesResponse): Source[] {
    return response.sources.map(source => this.toEntityFromResource(source));
  }
}
