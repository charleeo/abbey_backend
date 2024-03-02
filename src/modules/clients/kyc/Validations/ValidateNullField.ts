import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { KYCRepository } from '../repositories/kyc.repository';
import { KYC } from '../entities/kyc.entity';
import { KycService } from '../kyc.service';

@ValidatorConstraint({ name: 'validate_phone', async: true })
@Injectable()
export class ValidateNullField implements ValidatorConstraintInterface {
  constructor(private readonly service: KycService) {}

  validate = async (
    value: any,
    args: ValidationArguments,
  ): Promise<boolean> => {
    const [entityClass, fieldName] = args.constraints;
    return true;
  };

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName} '${args.value}' has already been taken`;
  }
}
