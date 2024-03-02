import { VerifyKycMiddleware } from './verify-kyc.middleware';

describe('VerifyKycMiddleware', () => {
  it('should be defined', () => {
    expect(new VerifyKycMiddleware()).toBeDefined();
  });
});
