import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export class GraphQLTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerKey = environment.production ? 'x-api-key' : 'Authorization';
    const header: { [key: string]: string; } = {};
    header[headerKey] = environment.appsyncApiKey;
    req = req.clone({ setHeaders: header });
    return next.handle(req);
  }
}
