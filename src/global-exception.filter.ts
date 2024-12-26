import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlContextType } from '@nestjs/graphql';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType<GqlContextType>();

    if (contextType === 'http') {
      this.handleHttpException(exception, host);
    } else if (contextType === 'graphql') {
      this.handleGraphqlException(exception);
    } else {
      console.error('Unknown context type:', contextType);
    }
  }

  private handleHttpException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      response.status(status).json({
        statusCode: status,
        message: exceptionResponse['message'] || exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
        error: exception instanceof Error ? exception.message : String(exception),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }

  private handleGraphqlException(exception: unknown) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      return {
        statusCode: status,
        message: exceptionResponse['message'] || exception.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: exception instanceof Error ? exception.message : String(exception),
        timestamp: new Date().toISOString(),
      };
    }
  }
}
