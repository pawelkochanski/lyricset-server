import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserServiceSpecStub } from './user.service.spec.stub';
import { LyricsetService } from '../lyricset/lyricset.service';
import { LyricsetServiceSpecStub } from '../lyricset/lyricset.service.spec.stub';

describe('User Controller', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useClass: UserServiceSpecStub },
        { provide: LyricsetService, useClass: LyricsetServiceSpecStub },
      ],
    }).compile();

    userService = module.get(UserService);
    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should throw error if no username', () => {
      return expect(controller.register({
        username: null,
        email: 'sss',
        password: 'ssss',
      })).rejects.toThrow('username is required');
    });

    it('should throw error if no email', () => {
      return expect(controller.register({
        username: 'null',
        email: null,
        password: 'ssssss',
      })).rejects.toThrow('email is required');
    });

    it('should throw error if no password', () => {
      return expect(controller.register({
        username: 'null',
        email: 'null',
        password: null,
      })).rejects.toThrow('password is required');
    });

    it('should throw error if username exists', () => {
      jest.spyOn(userService, 'findOne').mockReturnValue(Promise.resolve({}) as Promise<InstanceType<any>>);
      return expect(controller.register({
        username: 'null',
        email: 'null',
        password: 'sssss',
      })).rejects.toThrow(`email exists`);
    });
  });

  describe('getUserSetlist', () => {
    it('should throw error if user doesnt exists', () => {
        jest.spyOn(userService, 'fidnById').mockReturnValue(null);
        expect(controller.getUserSetlist('13')).rejects.toThrow('user not exists');
    });
  });
});
