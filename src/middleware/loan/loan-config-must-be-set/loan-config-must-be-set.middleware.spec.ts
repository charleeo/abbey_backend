import { LoanConfigMustBeSetMiddleware } from './loan-config-must-be-set.middleware';

describe('LoanConfigMustBeSetMiddleware', () => {
  it('should be defined', () => {
    expect(new LoanConfigMustBeSetMiddleware()).toBeDefined();
  });
});
