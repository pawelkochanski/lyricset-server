import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { BandsService } from '../bands/bands.service';
import { BandsServiceSpecStub } from '../bands/bands.service.spec.stub';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../user/models/user.model';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let bandService: BandsService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: BandsService, useClass: BandsServiceSpecStub },
        {
          provide: AuthService, useClass: class {
            getUserFromToken =  jest.fn();
          },
        },
      ],
    }).compile();

    bandService = module.get(BandsService);
    authService = module.get(AuthService);
    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
