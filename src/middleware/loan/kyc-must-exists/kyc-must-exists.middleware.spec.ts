import { KycMustExistsMiddleware } from './kyc-must-exists.middleware';

describe('KycMustExistsMiddleware', () => {
  it('should be defined', () => {
    expect(new KycMustExistsMiddleware()).toBeDefined();
  });
});
