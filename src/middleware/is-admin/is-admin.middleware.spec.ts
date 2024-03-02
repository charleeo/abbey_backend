import { IsAdminMiddleware } from './is-admin.middleware';

describe('IsAdminMiddleware', () => {
  it('should be defined', () => {
    expect(new IsAdminMiddleware()).toBeDefined();
  });
});
