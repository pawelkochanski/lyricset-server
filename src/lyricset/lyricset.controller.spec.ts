import { Test, TestingModule } from '@nestjs/testing';
import { LyricsetController } from './lyricset.controller';
import { LyricsetService } from './lyricset.service';
import { LyricsetServiceSpecStub } from './lyricset.service.spec.stub';
import { UserService } from '../user/user.service';
import { UserServiceSpecStub } from '../user/user.service.spec.stub';
import { LyricSetParams } from './models/view-models/lyricset.params.model';
import { User } from '../user/models/user.model';
import exp = require('constants');
import { Lyricset } from './models/lyricset.model';
import { LyricsetUpdateVm } from './models/view-models/update-vm.model';

describe('Lyricset Controller', () => {
  let controller: LyricsetController;
  let lyricsetService: LyricsetService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LyricsetController],
      providers: [
        { provide: LyricsetService, useClass: LyricsetServiceSpecStub },
        { provide: UserService, useClass: UserServiceSpecStub },
      ],
    }).compile();

    lyricsetService = module.get<LyricsetService>(LyricsetService);
    controller = module.get<LyricsetController>(LyricsetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if name is not defined', () => {
      return expect(controller.create({ name: null } as LyricSetParams, {} as User, {} as Request)).rejects.toThrow('Name is required');
    });
  });

  describe('getById', () => {
    it('should throw error if set doesent exist', () => {
      jest.spyOn(lyricsetService, 'fidnById').mockReturnValue(Promise.resolve(null));
      return expect(controller.getById('13', null)).rejects.toThrow('set doesnt exist');
    });

    it('should throw error if lyricset is Private and user is not owner', () => {
      jest.spyOn(lyricsetService, 'fidnById').mockReturnValue(Promise.resolve({ isPrivate: true }) as Promise<InstanceType<any>>);
      return expect(controller.getById('13', { setlist: ['14'] } as User)).rejects.toThrow('not your set');
    });

    it('should return value if set is private and user is owner', () => {
      jest.spyOn(lyricsetService, 'fidnById').mockReturnValue(Promise.resolve({
        isPrivate: true,
        toJSON: jest.fn(() => true),
      }) as Promise<InstanceType<any>>);
      jest.spyOn(lyricsetService, 'map').mockReturnValue(Promise.resolve(true));
      return expect(controller.getById('13', { setlist: ['13'] } as User)).resolves.toBeTruthy();
    });
  });

  describe('update', () => {
    it('should throw error if no parameters', () => {
      return expect(controller.update('13', null, null)).rejects.toThrow('Missing parameters');
    });

    it('should throw error if lyricset not found', () => {
      jest.spyOn(lyricsetService, 'fidnById').mockReturnValue(Promise.resolve(null));
      return expect(controller.update('13',
        {
          name: '13',
          description: '13',
          tracklist: [],
          isPrivate: 'true',
        } as LyricsetUpdateVm, null)).rejects.toThrow('13 Not found');
    });

    it('should throw error if user doesnt have that lyricset', () => {
      jest.spyOn(lyricsetService, 'fidnById').mockReturnValue(Promise.resolve({}) as Promise<InstanceType<any>>);
      return expect(controller.update('13',
        {
          name: '13',
          description: '13',
          tracklist: [],
          isPrivate: 'true',
        } as LyricsetUpdateVm, { setlist: [] } as User)).rejects.toThrow('Permission denied.');
    });

    it('should throw error if track is duplicate', () => {
      jest.spyOn(lyricsetService, 'fidnById').mockReturnValue(Promise.resolve({}) as Promise<InstanceType<any>>);
      return expect(controller.update('13',
        {
          name: '13',
          description: '13',
          tracklist: [{ track_id: 14 }, { track_id: 14 }],
          isPrivate: 'true',
        } as LyricsetUpdateVm, { setlist: ['13'] } as User)).rejects.toThrow('track exists');

    });
  });

  describe('rateSet', () => {
    it('should throw error if rate is bigger than 5', () => {
      return expect(controller.rateSet('13', null, 13)).rejects.toThrow('wrong rate');
    });
  });

  describe('deleteUsersSet', () => {
    it('should throw error if user doesnt have that set', () => {
      return expect(controller.deleteUsersset('13', { setlist: [] } as User)).rejects.toThrow('Permission denied.');
    })
  });
});
