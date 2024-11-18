import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAppError, CustomApolloServerErrorCode } from './shared/create-error/create-error';

@Injectable()
export class AppValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // console.log(metatype, value);

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    
    if (!object) {
      return value;
    }

    const errors = await validate(object);

    if (errors.length > 0) {
      const errorsMessage: any = [];
      errors.forEach((error: any) => {
        const e: any = {};
        e['field'] = error.property
        e['message'] = Object.values(error?.constraints).toString();
        errorsMessage.push(e);
      });



      throw new CreateAppError({ message: `${JSON.stringify(errorsMessage)}`, httpStatus: CustomApolloServerErrorCode.INPUT_VALIDATION  });
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}