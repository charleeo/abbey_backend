import { Test, TestingModule } from '@nestjs/testing';
import { Event } from './event';

describe('Event', () => {
  let provider: Event;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Event],
    }).compile();

    provider = module.get<Event>(Event);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
