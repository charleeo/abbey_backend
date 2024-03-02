import { PreventDupplicatesMiddleware } from './prevent-dupplicates.middleware';

describe('PreventDupplicatesMiddleware', () => {
  it('should be defined', () => {
    expect(new PreventDupplicatesMiddleware()).toBeDefined();
  });
});
