import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { MapperService } from '../shared/mapper/mapper.service';
import { AuthService } from '../shared/auth/auth.service';
import exp = require('constants');
import { LoginVm } from './models/view-models/login-vm.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.modelName), useValue: User },
        MapperService,
        {
          provide: AuthService, useValue: {
            singPayload: jest.fn(),
            verify: jest.fn(),
            validatePayload: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('login', () => {
    it('should throw error if invalid username', () => {
      jest.spyOn(service, 'findOne').mockReturnValue(null);
      return expect(service.login({ username: '', password: '' } as LoginVm)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if no password match', () => {
      jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve({ password: '1234' }) as Promise<InstanceType<any>>);
      return expect(service.login({ username: '', password: '' } as LoginVm)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('setAvatar', () => {
    it('should throw error if avatarId === ""', () => {
      return expect(service.setAvatar(null, '')).rejects.toThrow('Wrong AvatarId');
    });
  });
});
