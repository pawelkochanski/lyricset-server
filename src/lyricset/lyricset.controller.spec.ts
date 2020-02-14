import { Test, TestingModule } from '@nestjs/testing';
import { LyricsetController } from './lyricset.controller';

describe('Lyricset Controller', () => {
  let controller: LyricsetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LyricsetController],
    }).compile();

    controller = module.get<LyricsetController>(LyricsetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
