import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { KycService } from '../kyc.service';

@ValidatorConstraint({ name: 'id', async: true })
@Injectable()
export class ValidateKYCId implements ValidatorConstraintInterface {
  constructor(private readonly service: KycService) {}

  validate = async (
    value: any,
    args: ValidationArguments,
  ): Promise<boolean> => {
    const [entityClass, fieldName] = args.constraints;
    const entity = await this.service.findOne(value, fieldName);
    if (!entity) {
      return false;
    } else return true;
  };

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName} '${args.value}' was not found`;
  }
}
