import { Test, TestingModule } from '@nestjs/testing';
import { BandsService } from './bands.service';
import { Band } from './models/band.model';
import { InstanceType, ModelType } from 'typegoose';
import { getModelToken } from '@nestjs/mongoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { BaseService } from '../shared/base.service';

describe('BandsService', () => {
  let service: BandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BaseService
      ],
      providers: [
        BandsService,
        {
          provide: getModelToken(Band.modelName), useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            fidnById: jest.fn(),
            create: jest.fn(),
            findByIdAndRemove: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteMany: jest.fn(),
            modelName: 'Band',
          },
        },
        MapperService
      ],
    }).compile();

    service = module.get<BandsService>(BandsService);
  });

  test('should be defined', () => {
    expect(service).not.toBeDefined();
  });
});
