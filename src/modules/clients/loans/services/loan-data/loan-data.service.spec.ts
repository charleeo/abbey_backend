import { Test, TestingModule } from '@nestjs/testing';
import { LoanDataService } from './loan-data.service';

describe('LoanDataService', () => {
  let service: LoanDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanDataService],
    }).compile();

    service = module.get<LoanDataService>(LoanDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
