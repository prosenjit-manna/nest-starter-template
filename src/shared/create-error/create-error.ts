import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

export enum CustomApolloServerErrorCode {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INPUT_VALIDATION = 'INPUT_VALIDATION',
}
export class CreateAppError extends GraphQLError {
  constructor({
    message,
    httpStatus,
    error,
  }: {
    message: string;
    httpStatus?: HttpStatus | ApolloServerErrorCode | CustomApolloServerErrorCode;
    error?: Error;
  }) {
    console.log('CreateAppError', message, httpStatus, error);
    super(message, { extensions: { code: httpStatus ||  ApolloServerErrorCode.INTERNAL_SERVER_ERROR } });
  }
}
