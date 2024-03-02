import { Test, TestingModule } from '@nestjs/testing';
import { Account } from './account';

describe('Account', () => {
  let provider: Account;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Account],
    }).compile();

    provider = module.get<Account>(Account);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
