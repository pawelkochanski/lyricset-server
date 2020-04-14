import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { UserService } from '../user/user.service';
import { UserServiceSpecStub } from '../user/user.service.spec.stub';
import { LyricsetService } from '../lyricset/lyricset.service';
import { LyricsetServiceSpecStub } from '../lyricset/lyricset.service.spec.stub';
import { BandsService } from '../bands/bands.service';
import { BandsServiceSpecStub } from '../bands/bands.service.spec.stub';
import { User } from '../user/models/user.model';
import { MemberRoles } from '../bands/models/member-roles.enum';


describe('Image Controller', () => {

  const mockFile = {
    path: {
      replace: jest.fn(),
    },
  };

  let controller: ImageController;
  let userService: UserService;
  let bandService: BandsService;
  let lyricsetService: LyricsetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        { provide: UserService, useClass: UserServiceSpecStub },
        { provide: LyricsetService, useClass: LyricsetServiceSpecStub },
        { provide: BandsService, useClass: BandsServiceSpecStub },
      ],
    }).compile();

    lyricsetService = module.get(LyricsetService);
    userService = module.get(UserService);
    bandService = module.get(BandsService);
    controller = module.get<ImageController>(ImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('postAvatar', () => {
    it('should call userService.setAvatar', async () => {
      userService.setAvatar = jest.fn();
      await controller.postAvatar(mockFile, { avatarId: '13' });
      expect(userService.setAvatar).toHaveBeenCalled();
    });
  });

  describe('postBandImage', () => {
    it('should throw error if band doesnt exist', () => {
      jest.spyOn(bandService, 'fidnById')
        .mockReturnValue(
          Promise.resolve(
            null,
          ),
        );
      return expect(controller.postBandImage(mockFile, {} as User, 'fakeId')).rejects.toThrow('band doesnt exist');
    });

    it('should throw if user is not a member', () => {
      jest.spyOn(bandService, 'fidnById')
        .mockReturnValue(
          Promise.resolve(
            { members: [] },
          ) as Promise<InstanceType<any>>,
        );
      return expect(controller.postBandImage(mockFile, {} as User, 'fakeId')).rejects.toThrow('you are not a member');
    });

    it('should throw if user is not a leader', () => {
      jest.spyOn(bandService, 'fidnById')
        .mockReturnValue(
          Promise.resolve(
            { members: [{ role: MemberRoles.Member, userId: 'fakeId' }] },
          ) as Promise<InstanceType<any>>,
        );
      return expect(controller.postBandImage(mockFile, { id: 'fakeId' } as User, 'fakeId')).rejects.toThrow('you are not a leader');
    });
  });

});
