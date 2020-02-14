import { Test, TestingModule } from '@nestjs/testing';
import { LyricsetService } from './lyricset.service';

describe('LyricsetService', () => {
  let service: LyricsetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LyricsetService],
    }).compile();

    service = module.get<LyricsetService>(LyricsetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
