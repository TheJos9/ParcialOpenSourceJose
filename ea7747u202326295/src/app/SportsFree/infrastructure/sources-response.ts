
export interface SourcesResponse {

  status: string;

  sources: SourceResource[];
}

export interface SourceResource {

  id: string;

  name: string;

  description: string;

  url: string;

  urlToLogo: string;

  category: string;

  language: string;
  country: string;
}
