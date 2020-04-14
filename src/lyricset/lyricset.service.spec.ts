import { Test, TestingModule } from '@nestjs/testing';
import { LyricsetService } from './lyricset.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { getModelToken } from '@nestjs/mongoose';
import { Lyricset } from './models/lyricset.model';
import { LyricSetParams } from './models/view-models/lyricset.params.model';
import { User } from '../user/models/user.model';

describe('LyricsetService', () => {
  let service: LyricsetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LyricsetService,
        MapperService,
        { provide: getModelToken(Lyricset.modelName), useValue: Lyricset }],
    }).compile();

    service = module.get<LyricsetService>(LyricsetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create Lyricset',  () => {
    it('should call create' ,async() => {
      const spy = jest.spyOn(service, 'create').mockReturnValue(Promise.resolve({ toJSON: jest.fn() }) as Promise<InstanceType<any>>);
      await service.createLyricset({} as LyricSetParams, { id: 'fakeId' } as User);
      expect(spy).toHaveBeenCalled();
    });
  });
});
