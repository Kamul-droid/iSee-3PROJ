/**
 * Nestjs default imports
 */
import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';

@Catch()
export class TraceExceptionsFilter extends BaseExceptionFilter {
  /**
   * Internal logger
   */
  private readonly logger: Logger = new Logger(TraceExceptionsFilter.name, {
    timestamp: true,
  });

  /**
   * Overload of catch method to use in custom exceptions filter
   * @param exception the exception intercepted
   * @param host argument with execution context
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // call BaseExceptionFilter catch method
    super.catch(exception, host);

    //if exception is unknown, log a coherent message
    if (!(exception instanceof HttpException)) {
      this.logger.error({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
      });
      return;
    }
    const res = exception.getResponse();

    this.logger.error(res);
  }
}
