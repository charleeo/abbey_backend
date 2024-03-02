import { IsNotAdminMiddleware } from './is-not-admin.middleware';

describe('IsNotAdminMiddleware', () => {
  it('should be defined', () => {
    expect(new IsNotAdminMiddleware()).toBeDefined();
  });
});
