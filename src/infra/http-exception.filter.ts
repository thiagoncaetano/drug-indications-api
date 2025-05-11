import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface ResponseBody {
  code: number;
  message: string;
}

@Catch()
export class HTTPExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ResponseBody = {
      code: httpStatus,
      message: exception instanceof HttpException ? exception.message : 'Internal server error',
    };

    if (!(exception instanceof HttpException)) {
      console.error('Unexpected error:', exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
