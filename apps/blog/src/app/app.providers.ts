import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NZ_I18N, ro_RO } from 'ng-zorro-antd/i18n';
import { environment } from '../environments/environment';
import { GraphQLTokenInterceptor } from './graphql-token.interceptor';

export const apolloProviders = [
  {
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        cache: new InMemoryCache({ addTypename: false }),
        link: httpLink.create({ uri: environment.appsyncUrl }),
      };
    },
    deps: [HttpLink],
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: GraphQLTokenInterceptor,
    multi: true,
  },
];

export const langProviders = [
  {
    provide: NZ_I18N,
    useValue: ro_RO,
  },
];
