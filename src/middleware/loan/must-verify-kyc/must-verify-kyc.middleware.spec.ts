import { MustVerifyKycMiddleware } from './must-verify-kyc.middleware';

describe('MustVerifyKycMiddleware', () => {
  it('should be defined', () => {
    expect(new MustVerifyKycMiddleware()).toBeDefined();
  });
});
