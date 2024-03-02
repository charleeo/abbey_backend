import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { KYCRepository } from '../repositories/kyc.repository';

@ValidatorConstraint({ name: 'validate_phone', async: true })
@Injectable()
export class ValidateField implements ValidatorConstraintInterface {
  constructor(private readonly service: KYCRepository) {}

  validate = async (
    value: any,
    args: ValidationArguments
  ): Promise<boolean> => {
    const [entityClass, fieldName] = args.constraints;
    const entity = await this.service.findOne({
      where: { [`${fieldName}`]: value }
    });
    if (entity) {
      return false;
    } else {
      return true;
    }
    // return !entity;
  };

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName} '${args.value}' has already been taken`;
  }
}
