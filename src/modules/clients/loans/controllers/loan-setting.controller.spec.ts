import { Test, TestingModule } from '@nestjs/testing';
import { LoanSettingController } from './loan-setting.controller';

describe('LoanSettingController', () => {
  let controller: LoanSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanSettingController],
    }).compile();

    controller = module.get<LoanSettingController>(LoanSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
