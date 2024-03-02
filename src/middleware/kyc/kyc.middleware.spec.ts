import { KYCInputVaidtion } from './kyc.input.validation.middleware';

describe('KycMiddleware', () => {
  it('should be defined', () => {
    expect(new KYCInputVaidtion()).toBeDefined();
  });
});
