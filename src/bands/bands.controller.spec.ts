import { Test, TestingModule } from '@nestjs/testing';
import { BandsController } from './bands.controller';
import { UserService } from '../user/user.service';
import { BandsService } from './bands.service';
import { BandsServiceSpecStub } from './bands.service.spec.stub';
import { UserServiceSpecStub } from '../user/user.service.spec.stub';
import { LyricsetServiceSpecStub } from '../lyricset/lyricset.service.spec.stub';
import { LyricsetService } from '../lyricset/lyricset.service';
import { BandParamsVm } from './models/view-models/band-params-vm';
import { User } from '../user/models/user.model';
import { Band } from './models/band.model';
import { BandVm } from './models/view-models/band-vm.model';
import { MemberRoles } from './models/member-roles.enum';

describe('Bands Controller', () => {
  let controller: BandsController;
  let bandService: BandsService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BandsController],
      providers: [
        { provide: BandsService, useClass: BandsServiceSpecStub },
        { provide: UserService, useClass: UserServiceSpecStub },
        { provide: LyricsetService, useClass: LyricsetServiceSpecStub },
      ],
    }).compile();

    controller = module.get<BandsController>(BandsController);
    bandService = module.get(BandsService);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if name not defined', () => {
      expect(controller.create({ name: null } as BandParamsVm, {} as User)).rejects.toThrow();
    });


    it('should call bandservice.createBand, bandService.map and userServiceUpdate', async () => {
      bandService.createBand = jest.fn(() => Promise.resolve(
        {} as Band,
      ));
      const mapspy = jest.spyOn(bandService, 'map').mockReturnValue(Promise.resolve({ id: '13' }));
      const spy = jest.spyOn(userService, 'update');
      await controller.create({ name: '13' } as BandParamsVm, { bands: [] } as User);
      expect(spy).toHaveBeenCalled();
    });

    it('should call bandservice.delete on update error', () => {
      bandService.createBand = jest.fn(() => Promise.resolve(
        {} as Band,
      ));
      const mapspy = jest.spyOn(bandService, 'map').mockReturnValue(Promise.resolve({ id: '13' }));
      jest.spyOn(userService, 'update').mockReturnValue(Promise.reject());
      expect(controller.create({ name: '13' } as BandParamsVm, { bands: [] } as User)).rejects.toThrow();
    });
  });

  describe('addUser', () => {
    it('should throw error if band doesnt exist', () => {
      jest.spyOn(bandService, 'fidnById').mockReturnValue(Promise.resolve(null));
      expect(controller.addUser('fakeid', 'fakeId', 'isLeader', {} as User)).rejects.toThrow('band not exists');
    });


    it('should throw error if user doesnt exist', () => {
      // @ts-ignore
      jest.spyOn(bandService, 'fidnById').mockReturnValue(Promise.resolve({ id: '13' }) as Promise<InstanceType<Band>>);
      jest.spyOn(userService, 'fidnById').mockReturnValue(Promise.resolve(null));
      expect(controller.addUser('fakeid', 'fakeId', 'isLeader', {} as User)).rejects.toThrow('user not exists');
    });

    it('should throw error if user is member', () => {
      jest.spyOn(bandService, 'fidnById').mockReturnValue(Promise.resolve({
        id: 'fakeId',
      }) as Promise<InstanceType<any>>);
      jest.spyOn(userService, 'fidnById').mockReturnValue(Promise.resolve({
        bands: ['fakeId'],
      }) as Promise<InstanceType<any>>);
      expect(controller.addUser('fakeid', 'fakeId', 'isLeader', {} as User)).rejects.toThrow('user exists in band');
    });
  });

  describe('getAll', () => {
    it('should throw error if no user', () => {
      expect(controller.getAll(null)).rejects.toThrow('no user');
    });

    it('should throw error if findbyid error', () => {
      const user = { bands: '14' };
      jest.spyOn(bandService, 'fidnById').mockReturnValue(Promise.resolve(null));
      expect(controller.getAll(null)).rejects.toThrow();
    });
  });

  describe('getBandById', () => {
    it('should call verifyMember', async () => {
      const spy = jest.spyOn(bandService, 'verifyMember').mockReturnValue(Promise.resolve(
        {
          band: { id: '13', toJSON: jest.fn() },
          member: null,
        },
      ) as InstanceType<any>);
      jest.spyOn(bandService, 'map').mockReturnValue(Promise.resolve({ id: '13' }));
      await controller.getBandById('13', null);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('DeleteUserFromBand', () => {
      it('should throw error if user not leader', () => {
        const spy = jest.spyOn(bandService, 'verifyMember').mockReturnValue(Promise.resolve(
          {
            band: { id: '13', toJSON: jest.fn() },
            member: {userId: 'fakeId',role: MemberRoles.Member},
          },
        ) as InstanceType<any>);
        expect(controller.deleteUserFromBand('13', 'fakeId', {id: 'fakeId'} as User)).rejects.toThrow();
      });

    it('should throw error if member not found', () => {
      const spy = jest.spyOn(bandService, 'verifyMember').mockReturnValue(Promise.resolve(
        {
          band: { id: '13', toJSON: jest.fn() },
          member: {userId: 'fakeId',role: MemberRoles.Leader},
        },
      ) as InstanceType<any>);

      expect(controller.deleteUserFromBand('13', '12', {id: 'fakeId'} as User)).rejects.toThrow();
    });
    });

});
