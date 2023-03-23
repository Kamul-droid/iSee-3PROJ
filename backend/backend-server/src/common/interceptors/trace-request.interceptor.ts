/**
 * Needed import for current interceptor
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Defaut definition of our trace interceptor
 * This class is une with @UseInterceptor to trace all enter request
 */
@Injectable()
export class TraceRequestsInterceptor implements NestInterceptor {
  /**
   * Internal logger of this interceptor
   */
  private readonly logger: Logger = new Logger(TraceRequestsInterceptor.name, {
    timestamp: true,
  });
  /**
   * Main overload of intercept method to use it in custom class
   *
   * @param context current context to use in interceptor
   * @param next next call handler to use to continue the process
   * @return an observable
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // get need method to build our interceptor
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const request: Request = ctx.getRequest();
    // get some value for logging
    // maybe in a v2 used a wrapper of morgan package and build it into interceptor way
    const { originalUrl, method, params, query, body, headers } = request;
    const { statusCode } = ctx.getResponse();
    const remoteAddr: string =
      request.headers.forwarded || request.socket.remoteAddress;
    const remoteIp: string = request.ip;
    const url: string = request.url;
    const httpVersion: string = ['HTTP', request.httpVersion].join('/');
    const referer: string = request.headers['referer'] || '';
    const userAgent: string = request.headers['user-agent'] || '';

    // log informations about the request
    this.logger.verbose(
      `${remoteAddr} - ${remoteIp} "${method} ${url} ${httpVersion}" ${referer} ${userAgent}`,
      'IncommingRequest',
    );

    // log some request parameters for debug purpose
    this.logger.debug(
      {
        originalUrl,
        method,
        headers,
        params,
        query,
        body,
      },
      'Req',
    );

    //l og requests response for debug purpose
    return next.handle();
    // .pipe(
    //   tap((data) => {
    //     this.logger.debug(
    //       {
    //         statusCode,
    //         data,
    //       },
    //       'Res',
    //     );
    //   }),
    // );
  }
}
