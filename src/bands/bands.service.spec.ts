import { Test, TestingModule } from '@nestjs/testing';
import { BandsService } from './bands.service';
import { Band } from './models/band.model';
import { InstanceType, ModelType } from 'typegoose';
import { getModelToken } from '@nestjs/mongoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { BaseService } from '../shared/base.service';
import { BandParamsVm } from './models/view-models/band-params-vm';
import { User } from '../user/models/user.model';
import { DocumentToObjectOptions } from 'mongoose';

describe('BandsService', () => {
  let service: BandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BaseService,
      ],
      providers: [
        BandsService,
        { provide: getModelToken(Band.modelName), useValue: Band },

        MapperService,
      ],
    }).compile();

    service = module.get<BandsService>(BandsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBand', () => {
    it('should call this.create and return Band', async () => {
      const bandVm = { name: 'testBand' } as BandParamsVm;
      const user = { id: 'fakeId' } as User;
      service.create = jest.fn(() => Promise.resolve(
        {
          id: '13',
          toJSON(options?: DocumentToObjectOptions): any {
            return {
              id: this.id,
            };
          },
        } as InstanceType<Band>));
      expect(await service.createBand(bandVm, user)).toEqual({ id: '13' });
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('setImageBand', () => {
    it('should call this.fidnById and this.update if band exists', async () => {
      service.fidnById = jest.fn(() => Promise.resolve(
        { imageId: '13' } as InstanceType<Band>,
      ));
      service.update = jest.fn();
      await service.setImageBand('fakeId', 'fakeId');
      expect(service.update).toHaveBeenCalled();
    });

    it('should throw Error if band doesnt exist', () => {
      service.fidnById = jest.fn(() => Promise.resolve(
        null,
      ));
      service.update = jest.fn();
      expect(service.setImageBand('fakeId', 'fakeId')).rejects.toThrowError();
    });
  });

  describe('verifyMember', () => {
    const bandid = 'fakeId';
    const user = { id: 'fakeId', bands: [] } as User;

    it('should throw if user.bands doesnt include bandid', () => {
      expect(service.verifyMember(bandid, user)).rejects.toThrowError('not your band');
    });

    it('should throw error if band.members doesnt include user.id', () => {
      service.fidnById = jest.fn(() => Promise.resolve(
        { members: [] } as InstanceType<Band>,
      ));
      expect(service.verifyMember(bandid, user)).rejects.toThrowError('you are not a member');
    });
  });
});
